import { AxiosRequestConfig } from 'axios';
import { makeRequest } from '../core/httpUtils';
import {
  AllMembersResponse,
  MemberResponse,
  GenerateCodeRequest,
  GenerateCodeResponse,
  LinkExistingNexusRequest,
  LinkExistingNexusResponse,
  AuthCodeResponse,
  GroupTiersResponse,
  TierDetailsResponse,
  ScheduleRevShareRequest,
  ScheduleRevShareResponse,
  ListScheduledRevSharesResponse,
} from '../types/manage';

/**
 * Fetches all members for a group.
 */
export const getAllMembers = async (queryParams?: {
  page?: number;
  pageSize?: number;
  groupId?: string;
}): Promise<AllMembersResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return makeRequest<AllMembersResponse>(
    'public',
    'get',
    '/manage/members',
    undefined,
    config,
  );
};

export const getMemberByPlayerId = async (
  playerId: string,
  queryParams?: {
    groupId?: string;
  },
): Promise<MemberResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return makeRequest<MemberResponse>(
    'public',
    'get',
    `/manage/members/player/${playerId}`,
    config,
  );
};

export const getMemberByCodeOrId = async (
  codeOrId: string,
  queryParams?: {
    groupId?: string;
  },
): Promise<MemberResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return makeRequest<MemberResponse>(
    'public',
    'get',
    `/manage/members/${codeOrId}`,
    config,
  );
};

export const generateCode = async (
  data: GenerateCodeRequest,
  queryParams?: {
    groupId?: string;
  },
): Promise<GenerateCodeResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return makeRequest<GenerateCodeResponse>(
    'private',
    'post',
    '/manage/members',
    data,
    config,
  );
};

export const linkExistingNexus = async (
  data: LinkExistingNexusRequest,
  queryParams?: {
    groupId?: string;
  },
): Promise<LinkExistingNexusResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return makeRequest<LinkExistingNexusResponse>(
    'private',
    'post',
    '/manage/members/link',
    data,
    config,
  );
};

export const generateAuthCode = async (
  playerId: string,
): Promise<AuthCodeResponse> => {
  return makeRequest<AuthCodeResponse>(
    'private',
    'get',
    `/manage/members/${playerId}/authCode`,
  );
};

/**
 * Fetches all tiers for a group.
 */
export const getGroupTiers = async (queryParams?: {
  page?: number;
  pageSize?: number;
  groupId?: string;
}): Promise<GroupTiersResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return makeRequest<GroupTiersResponse>(
    'private',
    'get',
    '/manage/tiers',
    config,
  );
};

/**
 * Fetches details of a specific tier, including its members.
 */
export const getTierDetails = async (
  tierId: string,
  queryParams?: {
    groupId?: string;
  },
): Promise<TierDetailsResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return makeRequest<TierDetailsResponse>(
    'private',
    'get',
    `/manage/tiers/${tierId}`,
    config,
  );
};

/**
 * Schedules a temporary revenue share for a group.
 */
export const scheduleRevShare = async (
  data: ScheduleRevShareRequest,
  queryParams?: {
    groupId?: string;
  },
): Promise<ScheduleRevShareResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return await makeRequest<ScheduleRevShareResponse>(
    'private',
    'post',
    '/manage/scheduled-rev-shares',
    data,
    config,
  );
};

/**
 * Retrieves all scheduled revenue shares for a group.
 */
export const listScheduledRevShares = async (queryParams?: {
  page?: number;
  pageSize?: number;
  groupId?: string;
}): Promise<ListScheduledRevSharesResponse> => {
  const config: AxiosRequestConfig = { params: queryParams };
  return await makeRequest<ListScheduledRevSharesResponse>(
    'private',
    'get',
    '/manage/scheduled-rev-shares',
    config,
  );
};
