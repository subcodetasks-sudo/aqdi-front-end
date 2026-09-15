export type AuthUser = {
  id: number;
  fname: string;
  full_name: string;
  mobile: string;
  email: string;
  photo: string;
  verified: boolean;
  name: string;
  phone: string;
  status: boolean;
  created_at: string;
  date_time: string;
  properties_count: number;
  units_count: number;
  completed_orders_count: number;
  incomplete_orders_count: number;
  total_paid_amount: number;
};

export type LoginApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: {
    user: AuthUser;
    token: string;
  };
};
