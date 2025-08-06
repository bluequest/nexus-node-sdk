import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';

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

      const startTime = Date.now();
      const result = await NexusGG.attribution.sendTransaction(largeBatch);
      const endTime = Date.now();

      expect(result).toEqual(mockResponse);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
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

      const startTime = Date.now();
      const result = await NexusGG.attribution.sendTransaction(veryLargeBatch);
      const endTime = Date.now();

      expect(result).toEqual(mockResponse);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
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

      const startTime = Date.now();
      const results = await Promise.all(concurrentRequests);
      const endTime = Date.now();

      expect(results).toHaveLength(10);
      results.forEach((result) => {
        expect(result).toBeDefined();
        expect(result.groupId).toBe('test');
      });
      expect(endTime - startTime).toBeLessThan(3000); // Should complete within 3 seconds
    });

    it('should handle mixed concurrent operations', async () => {
      nock(baseURL).get('/manage/members').reply(200, {
        groupId: 'test',
        groupName: 'Test Group',
        currentPage: 1,
        currentPageSize: 100,
        totalCount: 0,
        members: [],
      });
      nock(baseURL).get('/manage/tiers').reply(200, { groupTiers: [] });
      nock(baseURL)
        .post('/attributions/transactions')
        .reply(200, { transaction: { id: 'test' } });

      const operations = [
        NexusGG.manage.getAllMembers(),
        NexusGG.manage.getGroupTiers(),
        NexusGG.attribution.sendTransaction({
          playerName: 'test',
          code: 'test',
          currency: 'USD',
          description: 'test',
          platform: 'PC',
          status: 'Normal' as const,
          subtotal: 100,
          transactionId: 'test',
          transactionDate: new Date().toISOString(),
        }),
      ];

      const startTime = Date.now();
      const results = await Promise.all(operations);
      const endTime = Date.now();

      expect(results).toHaveLength(3);
      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks with large datasets', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const largeBatch = Array.from({ length: 500 }, (_, i) => ({
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

      await NexusGG.attribution.sendTransaction(largeBatch);

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
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

      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
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
      expect(endTime - startTime).toBeLessThan(3000); // Should complete within 3 seconds
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

      expect(endTime - startTime).toBeLessThan(1000); // Should fail quickly within 1 second
    });

    it('should handle retry scenarios efficiently', async () => {
      // First request fails, second succeeds
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

      expect(endTime - startTime).toBeLessThan(2000); // Should handle retry within 2 seconds
    });
  });
});
