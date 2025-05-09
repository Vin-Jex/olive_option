import { listing_order } from "../../utils/consts";

export interface LoginType {
  email: string;
  password: string;
}

export interface CreateStaffType {
  full_name: string;
  email: string;
  is_admin?: boolean;
  password: string;
  permissions: {
    user?: boolean;
    financial?: boolean;
    affiliate?: boolean;
    trade?: boolean;
    promotional?: boolean;
  };
}

export interface ListStaffsType {
  q?: string;
  page: number;
  size: number;
  order: listing_order;
  user?: boolean;
  financial?: boolean;
  affiliate?: boolean;
  trade?: boolean;
  promotional?: boolean;
  is_admin?: boolean;
}

export interface EditStaffPermissionType {
  id: number;
  user?: boolean;
  financial?: boolean;
  affiliate?: boolean;
  trade?: boolean;
  promotional?: boolean;
}

export interface GetStaffActivitiesType {
  id: number;
  q?: string;
  page: number;
  size: number;
  order: listing_order;
}

export interface UpdateStaffType {
  first_name?: string;
  last_name?: string;
  email?: string;
  language?: string;
  enable_email_notifications?: boolean;
  enable_inapp_notifications?: boolean;
  two_factor_for_signin?: boolean;
  two_factor_for_activities?: boolean;
}
