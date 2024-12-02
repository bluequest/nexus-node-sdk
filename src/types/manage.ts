export interface Code {
  code: string;
  isPrimary: boolean;
  isGenerated: boolean;
  isManaged: boolean;
}

export interface MemberResponse {
  id: string;
  name: string;
  playerId: string;
  groupId: string;
  groupName: string;
  logoImage: string;
  profileImage: string;
  codes: Code[];
}

export interface AllMembersResponse {
  groupId: string;
  groupName: string;
  currentPage: number;
  currentPageSize: number;
  totalCount: number;
  members: MemberResponse[];
}

export interface GenerateCodeRequest {
  playerId: string;
  playerMetadata?: {
    displayName: string;
  };
}

export interface GenerateCodeResponse {
  groupId: string;
  groupName: string;
  playerId: string;
  playerMetadata?: {
    displayName: string;
  };
  code: string;
}

export interface LinkExistingNexusRequest {
  playerId: string;
  authCode: string;
  playerMetadata?: {
    displayName: string;
  };
}

export interface LinkExistingNexusResponse {
  groupId: string;
  groupName: string;
  id: string;
  playerId: string;
  codes: Array<{
    code: string;
    isPrimary: boolean;
    isGenerated: boolean;
    isManaged: boolean;
  }>;
}

export interface AuthCodeResponse {
  authCode: string;
  expiresAt: string;
}

export interface GroupTier {
  id: string;
  name: string;
  revShare: number;
  memberCount: number;
}

export interface GroupTiersResponse {
  groupId: string;
  groupName: string;
  currentPage: number;
  currentPageSize: number;
  totalCount: number;
  groupTiers: GroupTier[];
}

export interface TierMember {
  id: string;
  name: string;
  playerId: string;
  logoImage: string;
  profileImage: string;
  codes: Array<{
    code: string;
    isPrimary: boolean;
    isGenerated: boolean;
    isManaged: boolean;
  }>;
}

export interface TierDetailsResponse {
  groupId: string;
  groupName: string;
  id: string;
  name: string;
  revShare: number;
  currentPage: number;
  currentPageSize: number;
  totalCount: number;
  members: TierMember[];
}

export interface ScheduleRevShareRequest {
  revShare?: number;
  startDate: string;
  endDate: string;
  tierRevenueShares?: {
    tierId: string;
    revShare: number;
  }[];
}

export interface ScheduleRevShareResponse {
  id: string;
  revShare: number;
  startDate: string;
  endDate: string;
  groupId: string;
  groupName: string;
  tierRevenueShares: {
    tierId: string;
    revShare: number;
    tierName: string;
  }[];
}

export interface ListScheduledRevSharesResponse {
  groupId: string;
  groupName: string;
  currentPage: number;
  currentPageSize: number;
  totalCount: number;
  scheduledRevShares: {
    id: string;
    revShare: number;
    startDate: string;
    endDate: string;
    status: string;
    tierRevenueShares: {
      tierId: string;
      revShare: number;
      tierName: string;
    }[];
  }[];
}
