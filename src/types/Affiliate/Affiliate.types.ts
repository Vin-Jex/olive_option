export interface RevenueSharing {
  affiliateId: string;
  currentRate: number;
  currentLevel: string;
  nextLevel: string;
  numberOfDepositsUntilNextLevel: number;
}

export interface Affiliate {
  id: string;
  totalHold: number;
  nextPayment: string;
  earningsAllTime: number;
}

export interface TurnoverSharing {
  affiliateId: string;
  currentRate: number;
  currentLevel: string;
  nextLevel: string;
  numberOfDepositsUntilNextLevel: number;
}

export interface ServiceResponse<T> {
  ok: boolean;
  message: string | string[];
  statusCode: number;
  body: T | null;
  tokens?: { accessToken?: string; refreshToken?: string };
}

export type TokenTypes = {
  accessToken?: string;
  refreshToken?: string;
};

export interface PaginatedServiceResponse<T> {
  ok: boolean;
  message: string | string[];
  statusCode: number;
  body: {
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
    items: T[];
  } | null;
  tokens?: TokenTypes;
}

export type AffiliateUserSortableFields =
  | "full_name"
  | "email"
  | "is_active"
  | "tier_level"
  | "total_referrals"
  | "created_at";

export interface AffiliateUserQuery {
  page: number;
  size: number;
  tokens: TokenTypes;
  filters: FiltersType;
}

export interface AffiliateLinkQuery {
  page: number;
  size: number;
  filters?: {
    searchQuery?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    affiliateProgramId?: number;
  };
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export type FiltersType = {
  active?: boolean;
  tier_level?: number;
  total_referrals?: number;
  sortBy?: AffiliateUserSortableFields;
  sortOrder?: "ASC" | "DESC";
  searchQuery?: string;
};

export interface IReferralData {
  id: string | number;
  full_name: string;
  email: string;
  verification_status: boolean;
  userType: "Trader" | "Affiliate";
  registration_date: Date;
  referred_count: number;
}

export interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  ip?: string;
}

export enum EActivityType {
  SIGN_IN = "sign_in",
  SIGN_UP = "sign_up",
  PASSWORD_CHANGE = "password_change",
  ACCOUNT_VERIFICATION = "account_verification",
  REFERRAL_SIGNUP = "referral_signup",
  LOGOUT = "logout",
}

export interface IDevice {
  device: string;
  os: string;
  browser: string;
}

export type TMetaData = {
  device: IDevice;
  location?: LocationInfo;
  engagement: {
    timestamp: string;
    userAgent: string;
  };
};

export type AllUsersType = "AffiliateUser" | "Staff" | "User";

