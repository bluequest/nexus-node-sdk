import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';
import { UpdateTransactionRequest } from '../../src/services/attribution';

describe('Transaction Service', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should attribute a transaction to a member', async () => {
    const request = {
      playerName: 'dustywusty',
      code: 'popcornfrog',
      currency: 'USD',
      description: '1000 gems',
      platform: 'PC',
      status: 'Normal',
      subtotal: 999,
      transactionId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      transactionDate: '2017-07-21T17:32:28Z',
    };

    const mockResponse = {
      transaction: {
        id: 'TransactionID123',
        ...request,
        memberPlayerId: 'uniquePlayerId',
        total: 999,
        totalCurrency: 'USD',
        memberSharePercent: 10,
      },
    };

    nock(baseURL)
      .post('/attributions/transactions', [request])
      .reply(200, mockResponse);

    const result = await NexusGG.attribution.sendTransaction(request);
    expect(result).toEqual(mockResponse);
  });

  it('should attribute multiple transactions at once', async () => {
    const request = [
      {
        playerName: 'player1',
        code: 'code1',
        currency: 'USD',
        description: 'item1',
        platform: 'PC',
        status: 'Normal',
        subtotal: 500,
        transactionId: 'transaction1',
        transactionDate: '2023-01-01T10:00:00Z',
      },
      {
        playerName: 'player2',
        code: 'code2',
        currency: 'USD',
        description: 'item2',
        platform: 'PC',
        status: 'Normal',
        subtotal: 1500,
        transactionId: 'transaction1',
        transactionDate: '2023-01-01T10:00:00Z',
      },
    ];

    const mockResponse = [
      { transaction: { ...request[0], id: 'TransactionID1', total: 500 } },
      { transaction: { ...request[1], id: 'TransactionID2', total: 1500 } },
    ];

    nock(baseURL)
      .post('/attributions/transactions', request)
      .reply(200, mockResponse);

    const result = await NexusGG.attribution.sendTransaction(request);
    expect(result).toEqual(mockResponse);
  });

  it('should update a transaction status', async () => {
    const transactionId = 'transaction123';
    const request: UpdateTransactionRequest = { action: 'Refund' };

    const mockResponse = [
      {
        transaction: {
          id: transactionId,
          status: 'Refunded',
          currency: 'USD',
          description: '1000 gems',
          subtotal: 999,
          transactionDate: '2017-07-21T17:32:28Z',
        },
      },
    ];

    nock(baseURL)
      .patch(
        `/attributions/transactions/${transactionId}`,
        JSON.parse(JSON.stringify(request)),
      )
      .reply(200, mockResponse);

    const result = await NexusGG.attribution.updateTransaction(
      transactionId,
      request,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error for invalid currency', async () => {
    const invalidRequest = {
      playerName: 'invalidCurrencyPlayer',
      code: 'testCode',
      currency: 'INVALID',
      description: 'Invalid currency test',
      platform: 'PC',
      status: 'Normal',
      subtotal: 100,
      transactionId: 'invalidCurrency123',
      transactionDate: '2023-01-01T10:00:00Z',
    };

    await expect(
      NexusGG.attribution.sendTransaction(invalidRequest),
    ).rejects.toThrow('Invalid currency: INVALID');
  });

  it('should throw an error for zero or negative subtotal', async () => {
    const zeroSubtotalRequest = {
      playerName: 'zeroSubtotalPlayer',
      code: 'testCode',
      currency: 'USD',
      description: 'Zero subtotal test',
      platform: 'PC',
      status: 'Normal',
      subtotal: 0,
      transactionId: 'zeroSubtotal123',
      transactionDate: '2023-01-01T10:00:00Z',
    };

    await expect(
      NexusGG.attribution.sendTransaction(zeroSubtotalRequest),
    ).rejects.toThrow('Subtotal must be greater than zero.');

    const negativeSubtotalRequest = {
      ...zeroSubtotalRequest,
      subtotal: -100,
    };

    await expect(
      NexusGG.attribution.sendTransaction(negativeSubtotalRequest),
    ).rejects.toThrow('Subtotal must be greater than zero.');
  });

  it('should throw an error for non-integer subtotal with zero-decimal currency', async () => {
    const nonIntegerRequest = {
      playerName: 'nonIntegerPlayer',
      code: 'testCode',
      currency: 'JPY', // JPY is typically a zero-decimal currency
      description: 'Non-integer subtotal test',
      platform: 'PC',
      status: 'Normal',
      subtotal: 100.5,
      transactionId: 'nonInteger123',
      transactionDate: '2023-01-01T10:00:00Z',
    };

    await expect(
      NexusGG.attribution.sendTransaction(nonIntegerRequest),
    ).rejects.toThrow(
      'Subtotal for zero-decimal currency (JPY) must be an integer.',
    );
  });

  it('should succeed for valid zero-decimal currency with integer subtotal', async () => {
    const validRequest = {
      playerName: 'validPlayer',
      code: 'testCode',
      currency: 'JPY', // JPY is typically a zero-decimal currency
      description: 'Valid subtotal test',
      platform: 'PC',
      status: 'Normal',
      subtotal: 1000,
      transactionId: 'valid123',
      transactionDate: '2023-01-01T10:00:00Z',
    };

    const mockResponse = {
      transaction: {
        id: 'valid123',
        ...validRequest,
        total: 1000,
        memberSharePercent: 10,
      },
    };

    nock(baseURL)
      .post('/attributions/transactions', [validRequest])
      .reply(200, mockResponse);

    const result = await NexusGG.attribution.sendTransaction(validRequest);
    expect(result).toEqual(mockResponse);
  });

  describe('Input Validation', () => {
    it('should validate transaction date format', async () => {
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

    it('should validate player name is not empty', async () => {
      const emptyPlayerRequest = {
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
        .post('/attributions/transactions', [emptyPlayerRequest])
        .reply(400, { message: 'Player name cannot be empty' });

      await expect(
        NexusGG.attribution.sendTransaction(emptyPlayerRequest),
      ).rejects.toThrow();
    });

    it('should validate transaction ID format', async () => {
      const invalidTransactionIdRequest = {
        playerName: 'test',
        code: 'test',
        currency: 'USD',
        description: 'test',
        platform: 'PC',
        status: 'Normal' as const,
        subtotal: 100,
        transactionId: '', 
        transactionDate: new Date().toISOString(),
      };

      nock(baseURL)
        .post('/attributions/transactions', [invalidTransactionIdRequest])
        .reply(400, { message: 'Transaction ID cannot be empty' });

      await expect(
        NexusGG.attribution.sendTransaction(invalidTransactionIdRequest),
      ).rejects.toThrow();
    });
  });

  describe('Network Error Handling', () => {
    it('should handle network disconnections', async () => {
      nock(baseURL)
        .post('/attributions/transactions')
        .replyWithError(new Error('ECONNRESET'));

      const request = {
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

      await expect(
        NexusGG.attribution.sendTransaction(request),
      ).rejects.toThrow();
    });

    it('should handle rate limiting', async () => {
      nock(baseURL)
        .post('/attributions/transactions')
        .reply(429, { message: 'Rate limit exceeded' });

      const request = {
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

      await expect(
        NexusGG.attribution.sendTransaction(request),
      ).rejects.toThrow();
    });
  });

  describe('Boundary Testing', () => {
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

      const result = await NexusGG.attribution.sendTransaction(longNameRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Performance Testing', () => {
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
      expect(endTime - startTime).toBeLessThan(5000);
    });
  });
});
