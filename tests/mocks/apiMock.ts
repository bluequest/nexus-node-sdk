import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';

export const createMockServer = (baseURL: string = 'https://mock.api.nexus.gg') => {
  setupHttpMock(baseURL);
  return nock(baseURL);
};

export const mockMemberResponse = {
  groupId: 'test-group-id',
  groupName: 'Test Group',
  currentPage: 1,
  currentPageSize: 100,
  totalCount: 1,
  members: [
    {
      id: 'member-id-1',
      name: 'TestMember',
      codes: [{ code: 'testcode', isPrimary: true, isGenerated: false }],
    },
  ],
};

export const mockTransactionResponse = {
  transaction: {
    id: 'transaction-id-1',
    playerName: 'testplayer',
    code: 'testcode',
    currency: 'USD',
    description: 'Test transaction',
    platform: 'PC',
    status: 'Normal',
    subtotal: 100,
    transactionId: 'txn-123',
    transactionDate: '2024-01-01T00:00:00Z',
    total: 100,
    memberSharePercent: 10,
  },
};

export const mockErrorResponse = {
  message: 'Internal server error',
};
