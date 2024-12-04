import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';
import { AuthenticationError, ServerError } from '../../src/core/errors';

describe('Tier Services', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch all group tiers', async () => {
    const mockResponse = {
      groupId: 'AJ9OPrEFt4AAVJcA',
      groupName: 'Test Group',
      groupTiers: [
        { id: '1', name: 'Bronze', revShare: 15, memberCount: 5 },
        { id: '2', name: 'Silver', revShare: 20, memberCount: 10 },
        { id: '3', name: 'Gold', revShare: 25, memberCount: 1 },
      ],
    };

    nock(baseURL).get('/manage/tiers').reply(200, mockResponse);

    const result = await NexusGG.manage.getGroupTiers();
    expect(result).toEqual(mockResponse);
  });

  it('should fetch tier details', async () => {
    const tierId = '1';
    const mockResponse = {
      groupId: 'AJ9OPrEFt4AAVJcA',
      groupName: 'Test Group',
      id: tierId,
      name: 'Bronze',
      revShare: 15,
      members: [{ id: 'CsRKC8uD0NLtyQ0LOt8Ru', name: 'samzorz' }],
    };

    nock(baseURL).get(`/manage/tiers/${tierId}`).reply(200, mockResponse);

    const result = await NexusGG.manage.getTierDetails(tierId);
    expect(result).toEqual(mockResponse);
  });

  it('should throw AuthenticationError for a 401 response', async () => {
    const tierId = '1';

    nock(baseURL).get(`/manage/tiers/${tierId}`).reply(401);

    await expect(NexusGG.manage.getTierDetails(tierId)).rejects.toThrow(
      AuthenticationError,
    );
  });

  it('should throw ServerError for a 500 response', async () => {
    const tierId = '1';

    nock(baseURL)
      .get(`/manage/tiers/${tierId}`)
      .reply(500, { message: 'Internal server error.' });

    await expect(NexusGG.manage.getTierDetails(tierId)).rejects.toThrow(
      ServerError,
    );
  });
});
