import nock from 'nock';
import { setupHttpMock } from '../setupHttpMock';
import NexusGG from '../../src';
import { AuthenticationError } from '@core/errors';

describe('Member Services', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    setupHttpMock(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch all members of the group', async () => {
    const mockResponse = {
      groupId: 'CsRKC8uD0NLtyQ0LOt8Ru',
      groupName: 'Test Group',
      currentPage: 1,
      currentPageSize: 100,
      totalCount: 2,
      members: [
        {
          id: '9jd7RBR_B2BZ0uWO3_lgv',
          name: 'PopcornFrog',
          codes: [{ code: 'popcornfrog', isPrimary: true, isGenerated: false }],
        },
      ],
    };

    nock(baseURL).get('/manage/members').reply(200, mockResponse);

    const result = await NexusGG.manage.getAllMembers();
    expect(result).toEqual(mockResponse);
  });

  it('should fetch a member by playerId', async () => {
    const playerId = 'uniquePlayerId1';
    const mockResponse = {
      id: 'CsRKC8uD0NLtyQ0LOt8Ru',
      name: 'PopcornFrog',
      playerId,
      codes: [{ code: 'popcornfrog', isPrimary: true, isGenerated: false }],
    };

    nock(baseURL)
      .get(`/manage/members/player/${playerId}`)
      .reply(200, mockResponse);

    const result = await NexusGG.manage.getMemberByPlayerId(playerId);
    expect(result).toEqual(mockResponse);
  });

  it('should fetch a member by code or ID', async () => {
    const codeOrId = 'popcornfrog';
    const mockResponse = {
      id: 'CsRKC8uD0NLtyQ0LOt8Ru',
      name: 'PopcornFrog',
      playerId: 'uniquePlayerId1',
      codes: [{ code: 'popcornfrog', isPrimary: true, isGenerated: false }],
    };

    nock(baseURL).get(`/manage/members/${codeOrId}`).reply(200, mockResponse);

    const result = await NexusGG.manage.getMemberByCodeOrId(codeOrId);
    expect(result).toEqual(mockResponse);
  });

  it('should generate a code for a player', async () => {
    const request = { playerId: 'user123' };
    const mockResponse = {
      groupId: 'groupId123',
      groupName: 'Test Group',
      playerId: 'user123',
      code: 'abcd123',
    };

    nock(baseURL).post('/manage/members', request).reply(200, mockResponse);

    const result = await NexusGG.manage.generateCode(request);
    expect(result).toEqual(mockResponse);
  });

  it('should link an existing Nexus to the program', async () => {
    const request = { playerId: 'user123', authCode: 'auth123' };
    const mockResponse = {
      groupId: 'groupId123',
      groupName: 'Test Group',
      id: 'memberId123',
      playerId: 'user123',
      codes: [{ code: 'abcd123', isPrimary: true, isGenerated: false }],
    };

    nock(baseURL)
      .post('/manage/members/link', request)
      .reply(200, mockResponse);

    const result = await NexusGG.manage.linkExistingNexus(request);
    expect(result).toEqual(mockResponse);
  });

  it('should generate an authentication code for a player', async () => {
    const playerId = 'user123';
    const mockResponse = {
      authCode: '495-109',
      expiresAt: '2022-09-29T21:30:25.400Z',
    };

    nock(baseURL)
      .get(`/manage/members/${playerId}/authCode`)
      .reply(200, mockResponse);

    const result = await NexusGG.manage.generateAuthCode(playerId);
    expect(result).toEqual(mockResponse);
  });

  it('should throw AuthenticationError for a 401 response', async () => {
    nock(baseURL).get('/manage/members').reply(401);

    await expect(NexusGG.manage.getAllMembers()).rejects.toThrow(
      AuthenticationError,
    );
  });
});

describe('Manage Members Service with Query Params', () => {
  const baseURL = 'https://mock.api.nexus.gg';

  beforeEach(() => {
    nock(baseURL)
      .get('/manage/members')
      .query({ page: 1, pageSize: 10, groupId: 'group123' })
      .reply(200, {
        groupId: 'group123',
        groupName: 'Test Group',
        currentPage: 1,
        currentPageSize: 10,
        totalCount: 50,
        members: [
          {
            id: 'member1',
            name: 'Test Member',
            playerId: 'player123',
            codes: [],
          },
        ],
      });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch members with query parameters', async () => {
    const members = await NexusGG.manage.getAllMembers({
      page: 1,
      pageSize: 10,
      groupId: 'group123',
    });
    expect(members.currentPage).toBe(1);
    expect(members.groupId).toBe('group123');
    expect(members.members).toHaveLength(1);
  });
});
