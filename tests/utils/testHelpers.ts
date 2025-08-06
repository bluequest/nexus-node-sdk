import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';

export const createTestEnvironment = (baseURL: string = 'https://mock.api.nexus.gg') => {
  setupHttpMock(baseURL);
  return nock(baseURL);
};

export const measurePerformance = async (fn: () => Promise<any>) => {
  const startTime = process.hrtime.bigint();
  const result = await fn();
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1000000;
  return { result, duration };
};

export const createMockTransaction = (overrides: Partial<any> = {}) => ({
  playerName: 'testplayer',
  code: 'testcode',
  currency: 'USD',
  description: 'Test transaction',
  platform: 'PC',
  status: 'Normal' as const,
  subtotal: 100,
  transactionId: 'txn-123',
  transactionDate: new Date().toISOString(),
  ...overrides,
});

export const createMockMember = (overrides: Partial<any> = {}) => ({
  id: 'member-id-1',
  name: 'TestMember',
  codes: [{ code: 'testcode', isPrimary: true, isGenerated: false }],
  ...overrides,
});

export const createMockMemberResponse = (overrides: Partial<any> = {}) => ({
  groupId: 'test-group-id',
  groupName: 'Test Group',
  currentPage: 1,
  currentPageSize: 100,
  totalCount: 1,
  members: [createMockMember()],
  ...overrides,
});

export const createMockTransactionResponse = (overrides: Partial<any> = {}) => ({
  transaction: {
    id: 'transaction-id-1',
    ...createMockTransaction(),
    total: 100,
    memberSharePercent: 10,
    ...overrides,
  },
});

export const createMockErrorResponse = (message: string = 'Internal server error') => ({
  message,
});

export const setupConcurrentMocks = (
  baseURL: string,
  endpoint: string,
  method: 'get' | 'post' | 'patch' = 'get',
  response: any,
  count: number
) => {
  for (let i = 0; i < count; i++) {
    nock(baseURL)[method](endpoint).reply(200, response);
  }
};

export const setupErrorMocks = (
  baseURL: string,
  endpoint: string,
  method: 'get' | 'post' | 'patch' = 'get',
  statusCode: number = 500,
  errorResponse: any = { message: 'Internal server error' },
  count: number = 1
) => {
  for (let i = 0; i < count; i++) {
    nock(baseURL)[method](endpoint).reply(statusCode, errorResponse);
  }
};
