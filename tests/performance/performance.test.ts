import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';

const measurePerformance = async (fn: () => Promise<any>) => {
  const startTime = process.hrtime.bigint();
  const result = await fn();
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1000000;
  return { result, duration };
};

describe('Performance Tests', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Large Batch Processing', () => {
    it('should handle large transaction batches efficiently', async () => {
      const largeBatch = Array.from({ length: 100 }, (_, i) => ({
        playerName: `player${i}`,
        code: `code${i}`,
        currency: 'USD',
        description: `item${i}`,
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: `transaction${i}`,
        transactionDate: new Date().toISOString(),
      }));

      const mockResponse = largeBatch.map((transaction, i) => ({
        transaction: { ...transaction, id: `TransactionID${i}`, total: 100 },
      }));

      nock(baseURL)
        .post('/attributions/transactions', largeBatch)
        .reply(200, mockResponse);

      const { result, duration } = await measurePerformance(() =>
        NexusGG.attribution.sendTransaction(largeBatch)
      );

      expect(result).toEqual(mockResponse);
      expect(duration).toBeLessThan(5000);
    });

    it('should handle very large transaction batches', async () => {
      const veryLargeBatch = Array.from({ length: 1000 }, (_, i) => ({
        playerName: `player${i}`,
        code: `code${i}`,
        currency: 'USD',
        description: `item${i}`,
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: `transaction${i}`,
        transactionDate: new Date().toISOString(),
      }));

      const mockResponse = veryLargeBatch.map((transaction, i) => ({
        transaction: { ...transaction, id: `TransactionID${i}`, total: 100 },
      }));

      nock(baseURL)
        .post('/attributions/transactions', veryLargeBatch)
        .reply(200, mockResponse);

      const { result, duration } = await measurePerformance(() =>
        NexusGG.attribution.sendTransaction(veryLargeBatch)
      );

      expect(result).toEqual(mockResponse);
      expect(duration).toBeLessThan(10000);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle concurrent requests efficiently', async () => {
      for (let i = 0; i < 10; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }

      const concurrentRequests = Array.from({ length: 10 }, () =>
        NexusGG.manage.getAllMembers(),
      );

      const { result: results, duration } = await measurePerformance(() =>
        Promise.all(concurrentRequests)
      );

      expect(results).toHaveLength(10);
      results.forEach((result: any) => {
        expect(result).toBeDefined();
        expect(result.groupId).toBe('test');
      });
      expect(duration).toBeLessThan(3000);
    });

    it('should handle mixed concurrent operations', async () => {
      const memberRequests = Array.from({ length: 5 }, (_, i) => {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: `test${i}`,
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
        return NexusGG.manage.getAllMembers();
      });

      const transactionRequests = Array.from({ length: 5 }, (_, i) => {
        const transaction = {
          playerName: `player${i}`,
          code: `code${i}`,
          currency: 'USD',
          description: `item${i}`,
          platform: 'PC',
          status: 'Normal' as const,
          subtotal: 100,
          transactionId: `transaction${i}`,
          transactionDate: new Date().toISOString(),
        };

        nock(baseURL)
          .post('/attributions/transactions', [transaction])
          .reply(200, {
            transaction: { ...transaction, id: `TransactionID${i}`, total: 100 },
          });

        return NexusGG.attribution.sendTransaction(transaction);
      });

      const allRequests = [...memberRequests, ...transactionRequests];

      const { result: results, duration } = await measurePerformance(() =>
        Promise.all(allRequests)
      );

      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(5000);
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks with repeated operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      for (let i = 0; i < 50; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });

        await NexusGG.manage.getAllMembers();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Response Time Benchmarks', () => {
    it('should respond quickly for simple operations', async () => {
      nock(baseURL).get('/manage/members').reply(200, {
        groupId: 'test',
        groupName: 'Test Group',
        currentPage: 1,
        currentPageSize: 100,
        totalCount: 0,
        members: [],
      });

      const startTime = Date.now();
      await NexusGG.manage.getAllMembers();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle complex operations within reasonable time', async () => {
      const complexRequest = Array.from({ length: 50 }, (_, i) => ({
        playerName: `player${i}`,
        code: `code${i}`,
        currency: 'USD',
        description: `complex item ${i}`,
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100 + i,
        transactionId: `transaction${i}`,
        transactionDate: new Date().toISOString(),
      }));

      const mockResponse = complexRequest.map((transaction, i) => ({
        transaction: {
          ...transaction,
          id: `TransactionID${i}`,
          total: 100 + i,
        },
      }));

      nock(baseURL)
        .post('/attributions/transactions', complexRequest)
        .reply(200, mockResponse);

      const startTime = Date.now();
      const result = await NexusGG.attribution.sendTransaction(complexRequest);
      const endTime = Date.now();

      expect(result).toEqual(mockResponse);
      expect(endTime - startTime).toBeLessThan(3000);
    });
  });

  describe('Error Recovery Performance', () => {
    it('should handle errors quickly without performance degradation', async () => {
      nock(baseURL)
        .get('/manage/members')
        .reply(500, { message: 'Internal server error' });

      const startTime = Date.now();
      await expect(NexusGG.manage.getAllMembers()).rejects.toThrow();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); 
    });

    it('should handle retry scenarios efficiently', async () => {
      nock(baseURL)
        .get('/manage/members')
        .reply(500, { message: 'Internal server error' });

      nock(baseURL).get('/manage/members').reply(200, {
        groupId: 'test',
        groupName: 'Test Group',
        currentPage: 1,
        currentPageSize: 100,
        totalCount: 0,
        members: [],
      });

      const startTime = Date.now();

      try {
        await NexusGG.manage.getAllMembers();
      } catch (error) {
        // Expected to fail on first attempt
      }
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(2000); 
    });
  });
});
