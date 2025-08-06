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

describe('Load Tests', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent member requests', async () => {
      const concurrentCount = 20;

      for (let i = 0; i < concurrentCount; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }

      const requests = Array.from({ length: concurrentCount }, () =>
        NexusGG.manage.getAllMembers(),
      );

      const { result: results, duration } = await measurePerformance(() =>
        Promise.all(requests)
      );

      expect(results).toHaveLength(concurrentCount);
      results.forEach((result: any) => {
        expect(result).toBeDefined();
        expect(result.groupId).toBe('test');
      });
      expect(duration).toBeLessThan(5000);
    });

    it('should handle concurrent transaction submissions', async () => {
      const concurrentCount = 15;

      for (let i = 0; i < concurrentCount; i++) {
        nock(baseURL)
          .post('/attributions/transactions')
          .reply(200, {
            transaction: {
              id: `TransactionID${i}`,
              playerName: `player${i}`,
              code: `code${i}`,
              currency: 'USD',
              description: `item${i}`,
              platform: 'PC',
              status: 'Normal',
              subtotal: 100,
              transactionId: `transaction${i}`,
              total: 100,
            },
          });
      }

      const requests = Array.from({ length: concurrentCount }, (_, i) =>
        NexusGG.attribution.sendTransaction({
          playerName: `player${i}`,
          code: `code${i}`,
          currency: 'USD',
          description: `item${i}`,
          platform: 'PC',
          status: 'Normal' as const,
          subtotal: 100,
          transactionId: `transaction${i}`,
          transactionDate: new Date().toISOString(),
        }),
      );

      const { result: results, duration } = await measurePerformance(() =>
        Promise.all(requests)
      );

      expect(results).toHaveLength(concurrentCount);
      results.forEach((result: any, i: number) => {
        expect(result).toBeDefined();
        if (Array.isArray(result)) {
          expect(result[0].transaction.id).toBe(`TransactionID${i}`);
        } else {
          expect(result.transaction.id).toBe(`TransactionID${i}`);
        }
      });
      expect(duration).toBeLessThan(8000);
    });

    it('should handle mixed concurrent operations', async () => {
      const memberCount = 10;
      const transactionCount = 10;

      for (let i = 0; i < memberCount; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }

      for (let i = 0; i < transactionCount; i++) {
        nock(baseURL)
          .post('/attributions/transactions')
          .reply(200, {
            transaction: {
              id: `TransactionID${i}`,
              playerName: `player${i}`,
              code: `code${i}`,
              currency: 'USD',
              description: `item${i}`,
              platform: 'PC',
              status: 'Normal',
              subtotal: 100,
              transactionId: `transaction${i}`,
              total: 100,
            },
          });
      }

      const memberRequests = Array.from({ length: memberCount }, () =>
        NexusGG.manage.getAllMembers(),
      );

      const transactionRequests = Array.from({ length: transactionCount }, (_, i) =>
        NexusGG.attribution.sendTransaction({
          playerName: `player${i}`,
          code: `code${i}`,
          currency: 'USD',
          description: `item${i}`,
          platform: 'PC',
          status: 'Normal' as const,
          subtotal: 100,
          transactionId: `transaction${i}`,
          transactionDate: new Date().toISOString(),
        }),
      );

      const allRequests = [...memberRequests, ...transactionRequests];

      const { result: results, duration } = await measurePerformance(() =>
        Promise.all(allRequests)
      );

      expect(results).toHaveLength(memberCount + transactionCount);
      expect(duration).toBeLessThan(10000);
    });

    it('should handle concurrent operations with errors gracefully', async () => {
      const successCount = 15;
      const errorCount = 5;

      for (let i = 0; i < successCount; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }

      for (let i = 0; i < errorCount; i++) {
        nock(baseURL).get('/manage/members').reply(500, {
          message: 'Internal server error',
        });
      }

      const requests = Array.from({ length: successCount + errorCount }, () =>
        NexusGG.manage.getAllMembers().catch(error => ({ error: error.message }))
      );

      const { result: results, duration } = await measurePerformance(() =>
        Promise.all(requests)
      );

      expect(results).toHaveLength(successCount + errorCount);
      
      const successResults = results.filter((result: any) => !result.error);
      const errorResults = results.filter((result: any) => result.error);
      
      expect(successResults).toHaveLength(successCount);
      expect(errorResults).toHaveLength(errorCount);
      expect(duration).toBeLessThan(8000);
    });
  });

  describe('Stress Testing', () => {
    it('should handle rapid successive requests', async () => {
      const requestCount = 50;
      const requests: Promise<any>[] = [];

      for (let i = 0; i < requestCount; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });

        requests.push(NexusGG.manage.getAllMembers());
      }

      const { result: results, duration } = await measurePerformance(() =>
        Promise.all(requests)
      );

      expect(results).toHaveLength(requestCount);
      expect(duration).toBeLessThan(15000);
    });

    it('should handle large payload sizes', async () => {
      const largeTransaction = {
        playerName: 'test'.repeat(1000),
        code: 'test'.repeat(100),
        currency: 'USD',
        description: 'test'.repeat(500),
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      nock(baseURL)
        .post('/attributions/transactions', [largeTransaction])
        .reply(200, {
          transaction: { ...largeTransaction, id: 'TransactionID', total: 100 },
        });

      const { result, duration } = await measurePerformance(() =>
        NexusGG.attribution.sendTransaction(largeTransaction)
      );

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(5000);
    });
  });
});
