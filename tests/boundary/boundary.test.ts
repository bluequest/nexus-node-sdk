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
        subtotal: 0.01,
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

    it('should handle very large decimal amounts', async () => {
      const largeDecimalRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 999999.99,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...largeDecimalRequest,
          total: 999999.99,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [largeDecimalRequest])
        .reply(200, mockResponse);

      const result =
        await NexusGG.attribution.sendTransaction(largeDecimalRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('String Length Boundaries', () => {
    it('should handle very long player names', async () => {
      const longNameRequest = {
        playerName: 'a'.repeat(1000),
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

      const result =
        await NexusGG.attribution.sendTransaction(longNameRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle very long descriptions', async () => {
      const longDescriptionRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'a'.repeat(5000),
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

      const result =
        await NexusGG.attribution.sendTransaction(longDescriptionRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty strings for optional fields', async () => {
      const emptyFieldsRequest = {
        playerName: '',
        code: '',
        currency: 'USD',
        description: '',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: '',
        transactionDate: new Date().toISOString(),
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...emptyFieldsRequest,
          total: 100,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [emptyFieldsRequest])
        .reply(200, mockResponse);

      const result =
        await NexusGG.attribution.sendTransaction(emptyFieldsRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Currency Boundaries', () => {
    it('should handle zero-decimal currencies with integer amounts', async () => {
      const zeroDecimalRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'JPY',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 1000,
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

    it('should reject zero-decimal currencies with decimal amounts', async () => {
      const invalidZeroDecimalRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'JPY',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 1000.50,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      await expect(
        NexusGG.attribution.sendTransaction(invalidZeroDecimalRequest),
      ).rejects.toThrow('Subtotal for zero-decimal currency (JPY) must be an integer.');
    });

    it('should handle invalid currency codes', async () => {
      const invalidCurrencyRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'INVALID' as any,
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date().toISOString(),
      };

      await expect(
        NexusGG.attribution.sendTransaction(invalidCurrencyRequest),
      ).rejects.toThrow('Invalid currency: INVALID');
    });
  });

  describe('Date Boundaries', () => {
    it('should handle future dates', async () => {
      const futureDateRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
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

    it('should handle very old dates', async () => {
      const oldDateRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: 'test',
        transactionDate: '1970-01-01T00:00:00Z',
      };

      const mockResponse = {
        transaction: {
          id: 'test',
          ...oldDateRequest,
          total: 100,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [oldDateRequest])
        .reply(200, mockResponse);

      const result =
        await NexusGG.attribution.sendTransaction(oldDateRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Batch Size Boundaries', () => {
    it('should handle single transaction in batch', async () => {
      const singleTransaction = {
        playerName: 'test',
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
          ...singleTransaction,
          total: 100,
          memberSharePercent: 10,
        },
      };

      nock(baseURL)
        .post('/attributions/transactions', [singleTransaction])
        .reply(200, [mockResponse]);

      const result =
        await NexusGG.attribution.sendTransaction([singleTransaction]);
      expect(result).toEqual([mockResponse]);
    });

    it('should handle large batch sizes', async () => {
      const largeBatch = Array.from({ length: 1000 }, (_, i) => ({
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

      const result =
        await NexusGG.attribution.sendTransaction(largeBatch);
      expect(result).toEqual(mockResponse);
    });
  });
});

