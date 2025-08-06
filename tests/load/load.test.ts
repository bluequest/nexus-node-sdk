import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';

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

      const startTime = Date.now();
      const results = await Promise.all(requests);
      const endTime = Date.now();

      expect(results).toHaveLength(concurrentCount);
      results.forEach((result) => {
        expect(result).toBeDefined();
        expect(result.groupId).toBe('test');
      });
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
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

      const startTime = Date.now();
      const results = await Promise.all(requests);
      const endTime = Date.now();

      expect(results).toHaveLength(concurrentCount);
      results.forEach((result, i) => {
        expect(result).toBeDefined();
        // Handle both single response and array response
        if (Array.isArray(result)) {
          expect(result[0].transaction.id).toBe(`TransactionID${i}`);
        } else {
          expect(result.transaction.id).toBe(`TransactionID${i}`);
        }
      });
      expect(endTime - startTime).toBeLessThan(8000); // Should complete within 8 seconds
    });

    it('should handle mixed concurrent operations', async () => {
      // Set up mocks BEFORE creating requests
      for (let i = 0; i < 5; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }
      for (let i = 0; i < 5; i++) {
        nock(baseURL).get('/manage/tiers').reply(200, { groupTiers: [] });
      }
      for (let i = 0; i < 5; i++) {
        nock(baseURL)
          .post('/attributions/transactions')
          .reply(200, { transaction: { id: `TransactionID${i}` } });
      }

      const operations = [
        // Member operations
        ...Array.from({ length: 5 }, () => NexusGG.manage.getAllMembers()),
        ...Array.from({ length: 5 }, () => NexusGG.manage.getGroupTiers()),
        // Transaction operations
        ...Array.from({ length: 5 }, (_, i) =>
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
        ),
      ];

      const startTime = Date.now();
      const results = await Promise.all(operations);
      const endTime = Date.now();

      expect(results).toHaveLength(15);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Stress Testing', () => {
    it('should handle high-frequency requests', async () => {
      const requestCount = 50;

      for (let i = 0; i < requestCount; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }

      const requests = Array.from({ length: requestCount }, () =>
        NexusGG.manage.getAllMembers(),
      );

      const startTime = Date.now();
      const results = await Promise.all(requests);
      const endTime = Date.now();

      expect(results).toHaveLength(requestCount);
      expect(endTime - startTime).toBeLessThan(15000); // Should complete within 15 seconds
    });

    it('should handle rapid successive requests', async () => {
      const requestCount = 30;

      for (let i = 0; i < requestCount; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }

      const requests = Array.from({ length: requestCount }, () =>
        NexusGG.manage.getAllMembers(),
      );

      const startTime = Date.now();

      // Make requests concurrently
      const results = await Promise.all(requests);

      const endTime = Date.now();

      expect(results).toHaveLength(requestCount);
      expect(endTime - startTime).toBeLessThan(12000); // Should complete within 12 seconds
    });
  });

  describe('Resource Management', () => {
    it('should not exhaust memory with large concurrent operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const concurrentCount = 100;

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

      const results = await Promise.all(requests);
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      expect(results).toHaveLength(concurrentCount);
      // Memory increase should be reasonable (less than 100MB)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });

    it('should handle large payloads efficiently', async () => {
      const largePayload = Array.from({ length: 200 }, (_, i) => ({
        playerName: `player${i}`,
        code: `code${i}`,
        currency: 'USD',
        description: `large item ${i}`,
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100 + i,
        transactionId: `transaction${i}`,
        transactionDate: new Date().toISOString(),
      }));

      const mockResponse = largePayload.map((transaction, i) => ({
        transaction: {
          ...transaction,
          id: `TransactionID${i}`,
          total: 100 + i,
        },
      }));

      nock(baseURL)
        .post('/attributions/transactions', largePayload)
        .reply(200, mockResponse);

      const startTime = Date.now();
      const result = await NexusGG.attribution.sendTransaction(largePayload);
      const endTime = Date.now();

      expect(result).toEqual(mockResponse);
      expect(endTime - startTime).toBeLessThan(8000); // Should complete within 8 seconds
    });
  });

  describe('Error Handling Under Load', () => {
    it('should handle partial failures gracefully', async () => {
      const requestCount = 10;
      const failCount = Math.ceil(requestCount / 3);
      const successCount = requestCount - failCount;

      // Mock successful requests
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

      for (let i = 0; i < failCount; i++) {
        nock(baseURL)
          .get('/manage/members')
          .reply(500, { message: 'Internal server error' });
      }

      const requests = Array.from({ length: requestCount }, (_, i) =>
        NexusGG.manage.getAllMembers(),
      );

      const results = await Promise.allSettled(requests);

      const successfulResults = results.filter(
        (result) => result.status === 'fulfilled',
      );
      const failedResults = results.filter(
        (result) => result.status === 'rejected',
      );

      expect(successfulResults.length).toBeGreaterThan(0);
      expect(failedResults.length).toBeGreaterThan(0);
      expect(results.length).toBe(requestCount);
    });

    it('should maintain performance under error conditions', async () => {
      const requestCount = 20;

      for (let i = 0; i < requestCount; i++) {
        nock(baseURL)
          .get('/manage/members')
          .reply(500, { message: 'Internal server error' });
      }

      const requests = Array.from({ length: requestCount }, () =>
        NexusGG.manage.getAllMembers(),
      );

      const startTime = Date.now();
      const results = await Promise.allSettled(requests);
      const endTime = Date.now();

      expect(results).toHaveLength(requestCount);
      results.forEach((result) => {
        expect(result.status).toBe('rejected');
      });
      expect(endTime - startTime).toBeLessThan(10000); // Should fail quickly within 10 seconds
    });
  });

  describe('Scalability Testing', () => {
    it('should scale linearly with request volume', async () => {
      const smallBatch = 10;
      const largeBatch = 50;

      for (let i = 0; i < smallBatch; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }

      const smallRequests = Array.from({ length: smallBatch }, () =>
        NexusGG.manage.getAllMembers(),
      );

      const smallStartTime = Date.now();
      await Promise.all(smallRequests);
      const smallEndTime = Date.now();
      const smallDuration = smallEndTime - smallStartTime;

      nock.cleanAll();
      for (let i = 0; i < largeBatch; i++) {
        nock(baseURL).get('/manage/members').reply(200, {
          groupId: 'test',
          groupName: 'Test Group',
          currentPage: 1,
          currentPageSize: 100,
          totalCount: 0,
          members: [],
        });
      }

      const largeRequests = Array.from({ length: largeBatch }, () =>
        NexusGG.manage.getAllMembers(),
      );

      const largeStartTime = Date.now();
      await Promise.all(largeRequests);
      const largeEndTime = Date.now();
      const largeDuration = largeEndTime - largeStartTime;

      expect(largeDuration).toBeLessThan(smallDuration * 5);
    });
  });
});
