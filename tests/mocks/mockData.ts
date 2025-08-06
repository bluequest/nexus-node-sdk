import { TransactionResponse, Metrics } from '../../src/types/attribution';

export const newTransaction: TransactionResponse = {
  transaction: {
    id: 'test-transaction-id',
    code: 'TEST_CODE',
    memberPlayerId: 'member-player-123',
    description: 'Test transaction description',
    status: 'completed',
    subtotal: 100.0,
    currency: 'USD',
    total: 110.0,
    totalCurrency: 'USD',
    transactionId: 'txn-123456',
    transactionDate: '2024-01-01T00:00:00Z',
    platform: 'test-platform',
    playerId: 'player-123',
    playerName: 'Test Player',
    metrics: {
      joinDate: '2024-01-01T00:00:00Z',
      conversion: {
        lastPurchaseDate: '2024-01-01T00:00:00Z',
        totalSpendToDate: {
          total: 500.0,
          currency: 'USD',
        },
      },
    },
    memberShareAmount: 55.0,
    memberSharePercent: 50.0,
    memberPaid: true,
    skuId: 'sku-123',
  },
};
