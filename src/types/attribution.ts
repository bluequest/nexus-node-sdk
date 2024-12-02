export interface Metrics {
  joinDate: string;
  conversion: {
    lastPurchaseDate: string;
    totalSpendToDate: {
      total: number;
      currency: string;
    };
  };
}

export interface TransactionDetails {
  playerName: string;
  code: string;
  currency: string;
  description: string;
  platform: string;
  status: string;
  subtotal: number;
  transactionId: string;
  transactionDate: string;
  metrics?: Metrics;
  memberSharePercent?: number;
}

export interface TransactionResponse {
  transaction: {
    id: string;
    code: string;
    memberPlayerId: string;
    description: string;
    status: string;
    subtotal: number;
    currency: string;
    total: number;
    totalCurrency: string;
    transactionId: string;
    transactionDate: string;
    platform: string;
    playerId: string;
    playerName: string;
    metrics: Metrics;
    memberShareAmount: number;
    memberSharePercent: number;
    memberPaid: boolean;
    skuId: string;
  };
}
