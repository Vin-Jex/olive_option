import { ServiceResponse } from "./Affiliate.types";

export interface RevenueShareBody {
  countOfFTD: number;
  numberOfDeposits: number;
  sumOfDeposits: number;
  currentLevel: number;
  nextLevel: number;
  numberOfDepositsUntilNextLevel: number;
  currentRatePercentage: number;
  estimatedCommission: number;
}

export interface TurnoverShareBody extends RevenueShareBody {
  totalTurnover: number;
  K_ratio_adjustment: number;
}

export interface SubAffiliateBody {
  countOfFTD: number;
  numberOfDeposits: number;
  sumOfDeposits: number;
  currentLevel: number;
  nextLevel: number;
  numberOfDepositsUntilNextLevel: number;
  currentRatePercentage: number;
  estimatedCommission: number;
}

export interface UpdateAffiliateDataOptions {
  userId: string;
  tokens?: { accessToken?: string; refreshToken?: string };
  service: (
    userId: string,
    tokens?: { accessToken?: string; refreshToken?: string }
  ) => Promise<ServiceResponse<object>>;
  pushUpdateFn: (userId: string, result: ServiceResponse<object>) => void;
}


export const SUB_THRESHOLDS = [0, 15, 50, 100, 200, 400, 700, 900];
export const SUB_RATES = [2, 3, 4, 5, 6, 7, 8, 10];
export const TURNOVER_THRESHOLDS = [0, 15, 50, 100, 200, 400, 700, 900];
export const TURNOVER_RATES = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5];
export const REVENUE_THRESHOLDS = [0, 15, 50, 100, 200, 400, 700, 900];
export const REVENUE_RATES = [50, 55, 60, 65, 70, 75, 80, 85];