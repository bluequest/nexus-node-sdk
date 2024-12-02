import { AxiosRequestConfig } from 'axios';
import { makeRequest } from '../core/httpUtils';
import { TransactionDetails, TransactionResponse } from 'src/types/attribution';

export interface UpdateTransactionRequest {
  action: 'Refund' | 'Fraud' | 'Chargeback';
  playerId?: string;
}

/**
 * Attributes a transaction to a group member.
 */
export const sendTransaction = async (
  transactionDetails: TransactionDetails | TransactionDetails[],
  queryParams?: { groupId?: string },
): Promise<TransactionResponse | TransactionResponse[]> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return await makeRequest<TransactionResponse | TransactionResponse[]>(
    'private',
    'post',
    '/attributions/transactions',
    Array.isArray(transactionDetails)
      ? transactionDetails
      : [transactionDetails],
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
