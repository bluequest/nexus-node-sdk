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
});
