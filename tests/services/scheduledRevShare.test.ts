import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';

describe('Scheduled Revenue Shares Service', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should schedule a temporary revenue share', async () => {
    const request = {
      revShare: 20,
      startDate: '2023-06-21T15:00:00.000Z',
      endDate: '2023-06-23T15:00:00.000Z',
      tierRevenueShares: [
        { tierId: 'BronzeTierID', revShare: 25 },
        { tierId: 'SilverTierID', revShare: 30 },
      ],
    };

    const mockResponse = {
      id: 'ScheduleID123',
      revShare: 20,
      startDate: '2023-06-21T15:00:00.000Z',
      endDate: '2023-06-23T15:00:00.000Z',
      groupId: 'GroupID123',
      groupName: 'Test Group',
      tierRevenueShares: [
        { tierId: 'BronzeTierID', revShare: 25, tierName: 'Bronze' },
        { tierId: 'SilverTierID', revShare: 30, tierName: 'Silver' },
      ],
    };

    nock(baseURL)
      .post('/manage/scheduled-rev-shares', request)
      .reply(200, mockResponse);

    const result = await NexusGG.manage.scheduleRevShare(request);
    expect(result).toEqual(mockResponse);
  });

  it('should list all scheduled revenue shares', async () => {
    const mockResponse = {
      groupId: 'GroupID123',
      groupName: 'Test Group',
      currentPage: 1,
      currentPageSize: 100,
      totalCount: 1,
      scheduledRevShares: [
        {
          id: 'ScheduleID123',
          revShare: 20,
          startDate: '2023-06-21T15:00:00.000Z',
          endDate: '2023-06-23T15:00:00.000Z',
          status: 'Active',
          tierRevenueShares: [
            { tierId: 'BronzeTierID', revShare: 25, tierName: 'Bronze' },
          ],
        },
      ],
    };

    nock(baseURL).get('/manage/scheduled-rev-shares').reply(200, mockResponse);

    const result = await NexusGG.manage.listScheduledRevShares();
    expect(result).toEqual(mockResponse);
  });
});
