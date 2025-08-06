import nock from 'nock';

export function setupMocks(): void {
  nock('https://api.nexus.example')
    .persist()
    .get('/transactions')
    .reply(200, { transactions: [{ id: '123', amount: 100 }] })
    .get('/referrals')
    .reply(200, { referrals: [{ id: 'abc', code: 'XYZ' }] })
    .post('/transactions', { amount: 200 })
    .reply(201, { id: '456', amount: 200 });
}
