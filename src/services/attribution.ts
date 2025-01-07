import { AxiosRequestConfig } from 'axios';
import { makeRequest } from '../core/httpUtils';
import { TransactionDetails, TransactionResponse } from '../types/attribution';
import { Currency, ZERO_DECIMAL_CURRENCIES } from '../types/currencies';

export interface UpdateTransactionRequest {
  action: 'Refund' | 'Fraud' | 'Chargeback';
  playerId?: string;
}

const validateTransactionDetails = (transaction: TransactionDetails) => {
  if (!Object.values(Currency).includes(transaction.currency as Currency)) {
    throw new Error(`Invalid currency: ${transaction.currency}`);
  }

  if (transaction.subtotal <= 0) {
    throw new Error('Subtotal must be greater than zero.');
  }

  if (
    ZERO_DECIMAL_CURRENCIES.has(transaction.currency as Currency) &&
    transaction.subtotal % 1 !== 0
  ) {
    throw new Error(
      `Subtotal for zero-decimal currency (${transaction.currency}) must be an integer.`,
    );
  }
};

/**
 * Attributes a transaction to a group member.
 */
export const sendTransaction = async (
  transactionDetails: TransactionDetails | TransactionDetails[],
  queryParams?: { groupId?: string },
): Promise<TransactionResponse | TransactionResponse[]> => {
  const config: AxiosRequestConfig = { params: queryParams };

  const transactions = Array.isArray(transactionDetails)
    ? transactionDetails
    : [transactionDetails];

  transactions.forEach(validateTransactionDetails);

  return await makeRequest<TransactionResponse | TransactionResponse[]>(
    'private',
    'post',
    '/attributions/transactions',
    transactions,
    config,
  );
};

/**
 * Updates an existing transaction.
 */
export const updateTransaction = async (
  transactionId: string,
  updateDetails: UpdateTransactionRequest,
  queryParams?: { groupId?: string },
): Promise<TransactionResponse[]> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return await makeRequest<TransactionResponse[]>(
    'private',
    'patch',
    `/attributions/transactions/${transactionId}`,
    updateDetails,
    config,
  );
};
