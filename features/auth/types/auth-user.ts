export type AuthUser = {
  id: number;
  fname: string;
  mobile: string;
  verified: boolean;
  status: boolean;
  full_name?: string;
  email?: string;
  photo?: string;
  name?: string;
  phone?: string;
  created_at?: string;
  date_time?: string;
  properties_count?: number;
  units_count?: number;
  completed_orders_count?: number;
  incomplete_orders_count?: number;
  total_paid_amount?: number;
};

/** Shared shape of the token fields returned by both login and refresh-token. */
export type AuthTokenPayload = {
  token: string;
  refresh_token: string;
  token_expires_in: number;
  token_expires_at: string;
  refresh_token_expires_at: string;
};

export type LoginNotification = {
  title?: string;
  message?: string;
  [key: string]: unknown;
};

export type LoginApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: {
    user: AuthUser;
    login_notification?: LoginNotification | null;
  } & AuthTokenPayload;
};
