import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';

describe('Boundary Tests', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Transaction Amount Boundaries', () => {
    it('should handle maximum transaction amounts', async () => {
      const maxAmountRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: Number.MAX_SAFE_INTEGER,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...maxAmountRequest,
          total: Number.MAX_SAFE_INTEGER,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [maxAmountRequest])
        .reply(200, mockResponse);

      const result =
        await NexusGG.attribution.sendTransaction(maxAmountRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle minimum valid transaction amounts', async () => {
      const minAmountRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 0.01, // Minimum valid amount
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...minAmountRequest,
          total: 0.01,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [minAmountRequest])
        .reply(200, mockResponse);

      const result =
        await NexusGG.attribution.sendTransaction(minAmountRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle zero amounts (should fail)', async () => {
      const zeroAmountRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 0,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      await expect(
        NexusGG.attribution.sendTransaction(zeroAmountRequest),
      ).rejects.toThrow('Subtotal must be greater than zero.');
    });

    it('should handle negative amounts (should fail)', async () => {
      const negativeAmountRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: -100,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      await expect(
        NexusGG.attribution.sendTransaction(negativeAmountRequest),
      ).rejects.toThrow('Subtotal must be greater than zero.');
    });
  });

  describe('String Length Boundaries', () => {
    it('should handle very long player names', async () => {
      const longNameRequest = {
        playerName: 'a'.repeat(1000), // Very long player name
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...longNameRequest,
          total: 100,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [longNameRequest])
        .reply(200, mockResponse);

      const result = await NexusGG.attribution.sendTransaction(longNameRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle very long descriptions', async () => {
      const longDescriptionRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'a'.repeat(5000), // Very long description
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...longDescriptionRequest,
          total: 100,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [longDescriptionRequest])
        .reply(200, mockResponse);

      const result = await NexusGG.attribution.sendTransaction(
        longDescriptionRequest,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty strings appropriately', async () => {
      const emptyStringRequest = {
        playerName: '',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      nock(baseURL)
        .post('/attributions/transactions', [emptyStringRequest])
        .reply(400, { message: 'Player name cannot be empty' });

      await expect(
        NexusGG.attribution.sendTransaction(emptyStringRequest),
      ).rejects.toThrow();
    });
  });

  describe('Date Boundaries', () => {
    it('should handle far future dates', async () => {
      const futureDateRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date('2099-12-31T23:59:59Z').toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...futureDateRequest,
          total: 100,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [futureDateRequest])
        .reply(200, mockResponse);

      const result =
        await NexusGG.attribution.sendTransaction(futureDateRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle far past dates', async () => {
      const pastDateRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date('1900-01-01T00:00:00Z').toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...pastDateRequest,
          total: 100,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [pastDateRequest])
        .reply(200, mockResponse);

      const result = await NexusGG.attribution.sendTransaction(pastDateRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid date formats', async () => {
      const invalidDateRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: 'invalid-date',
      };

      nock(baseURL)
        .post('/attributions/transactions', [invalidDateRequest])
        .reply(400, { message: 'Invalid date format' });

      await expect(
        NexusGG.attribution.sendTransaction(invalidDateRequest),
      ).rejects.toThrow();
    });
  });

  describe('Array Boundaries', () => {
    it('should handle empty transaction arrays', async () => {
      const emptyArray: any[] = [];

      nock(baseURL)
        .post('/attributions/transactions', emptyArray)
        .reply(400, { message: 'At least one transaction is required' });

      await expect(
        NexusGG.attribution.sendTransaction(emptyArray),
      ).rejects.toThrow();
    });

    it('should handle single transaction in array', async () => {
      const singleTransaction = [
        {
          playerName: 'test',
          code: 'test',
          currency: 'USD',
          description: 'test',
          platform: 'PC',
          status: 'Normal' as const,
          subtotal: 100,
          transactionId: 'test',
          transactionDate: new Date().toISOString(),
        },
      ];

      const mockResponse = [
        {
          transaction: {
            id: 'test',
            ...singleTransaction[0],
            total: 100,
            memberSharePercent: 10,
          },
        },
      ];

      nock(baseURL)
        .post('/attributions/transactions', singleTransaction)
        .reply(200, mockResponse);

      const result =
        await NexusGG.attribution.sendTransaction(singleTransaction);
      expect(result).toEqual(mockResponse);
    });

    it('should handle maximum array size', async () => {
      const maxArraySize = 1000;
      const largeArray = Array.from({ length: maxArraySize }, (_, i) => ({
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

      const mockResponse = largeArray.map((transaction, i) => ({
        transaction: { ...transaction, id: `TransactionID${i}`, total: 100 },
      }));

      nock(baseURL)
        .post('/attributions/transactions', largeArray)
        .reply(200, mockResponse);

      const result = await NexusGG.attribution.sendTransaction(largeArray);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Currency Boundaries', () => {
    it('should handle all supported currencies', async () => {
      const supportedCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'CAD'];

      for (const currency of supportedCurrencies) {
        const currencyRequest = {
          playerName: 'test',
          code: 'test',
          currency: currency as any,
          description: 'test',
          platform: 'PC',
          status: 'Normal' as const,
          subtotal: 100,
          transactionId: `test-${currency}`,
          transactionDate: new Date().toISOString(),
        };

        const mockResponse = {
          transaction: {
            id: `test-${currency}`,
            ...currencyRequest,
            total: 100,
            memberSharePercent: 10,
          },
        };

        nock(baseURL)
          .post('/attributions/transactions', [currencyRequest])
          .reply(200, mockResponse);

        const result =
          await NexusGG.attribution.sendTransaction(currencyRequest);
        expect(result).toEqual(mockResponse);
      }
    });

    it('should handle zero-decimal currencies with integer amounts', async () => {
      const zeroDecimalRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'JPY',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 1000, // Integer amount for JPY
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...zeroDecimalRequest,
          total: 1000,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [zeroDecimalRequest])
        .reply(200, mockResponse);

      const result =
        await NexusGG.attribution.sendTransaction(zeroDecimalRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Platform and Status Boundaries', () => {
    it('should handle all supported platforms', async () => {
      const supportedPlatforms = ['PC', 'Mobile', 'Console', 'Web'];

      for (const platform of supportedPlatforms) {
        const platformRequest = {
          playerName: 'test',
          code: 'test',
          currency: 'USD',
          description: 'test',
          platform: platform as any,
          status: 'Normal' as const,
          subtotal: 100,
          transactionId: `test-${platform}`,
          transactionDate: new Date().toISOString(),
        };

        const mockResponse = {
          transaction: {
            id: `test-${platform}`,
            ...platformRequest,
            total: 100,
            memberSharePercent: 10,
          },
        };

        nock(baseURL)
          .post('/attributions/transactions', [platformRequest])
          .reply(200, mockResponse);

        const result =
          await NexusGG.attribution.sendTransaction(platformRequest);
        expect(result).toEqual(mockResponse);
      }
    });

    it('should handle all supported statuses', async () => {
      const supportedStatuses = ['Normal', 'Refunded', 'Fraud', 'Chargeback'];

      for (const status of supportedStatuses) {
        const statusRequest = {
          playerName: 'test',
          code: 'test',
          currency: 'USD',
          description: 'test',
          platform: 'PC',
          status: status as any,
          subtotal: 100,
          transactionId: `test-${status}`,
          transactionDate: new Date().toISOString(),
        };

        const mockResponse = {
          transaction: {
            id: `test-${status}`,
            ...statusRequest,
            total: 100,
            memberSharePercent: 10,
          },
        };

        nock(baseURL)
          .post('/attributions/transactions', [statusRequest])
          .reply(200, mockResponse);

        const result = await NexusGG.attribution.sendTransaction(statusRequest);
        expect(result).toEqual(mockResponse);
      }
    });
  });

  describe('Response Boundaries', () => {
    it('should handle empty response arrays', async () => {
      nock(baseURL)
        .get('/manage/members')
        .reply(200, { members: [], totalCount: 0 });

      const result = await NexusGG.manage.getAllMembers();
      expect(result.members).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should handle very large response arrays', async () => {
      const largeMembersArray = Array.from({ length: 1000 }, (_, i) => ({
        id: `member${i}`,
        name: `Member ${i}`,
        playerId: `player${i}`,
        codes: [{ code: `code${i}`, isPrimary: true, isGenerated: false }],
      }));

      nock(baseURL).get('/manage/members').reply(200, {
        groupId: 'test',
        groupName: 'Test Group',
        currentPage: 1,
        currentPageSize: 1000,
        totalCount: 1000,
        members: largeMembersArray,
      });

      const result = await NexusGG.manage.getAllMembers();
      expect(result.members).toHaveLength(1000);
      expect(result.totalCount).toBe(1000);
    });

    it('should handle null values in responses', async () => {
      nock(baseURL).get('/manage/members').reply(200, {
        groupId: null,
        groupName: null,
        currentPage: 1,
        currentPageSize: 100,
        totalCount: 0,
        members: [],
      });

      const result = await NexusGG.manage.getAllMembers();
      expect(result.groupId).toBeNull();
      expect(result.groupName).toBeNull();
    });
  });
});
