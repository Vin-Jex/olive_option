import { setting_keys } from "../../utils/consts";

export interface CreateUpdateSettingType {
  key: setting_keys;
  value: any;
}

export interface BlockIpType {
  ip: string;
}

export interface CreateCustomProfitOutcomeType {
  ticker: string;
  profit_outcome: any;
}

export interface EditCustomProfitOutcomeType {
  id: number;
  ticker?: string;
  profit_outcome?: any;
}

export interface CreateComissionType {
  ticker: string;
  sell_commission: any;
  buy_commission: any;
}

export interface EditComissionType {
  id: number;
  ticker?: string;
  sell_commission?: any;
  buy_commission?: any;
}
