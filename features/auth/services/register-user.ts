"use server";

import { apiRequest } from "@/lib/api/api-request";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type RegisterUserPayload = {
  fullName: string;
  phone: string;
  password: string;
};

type RegisterUserApiData = {
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

type RegisterUserApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: RegisterUserApiData;
};

export async function registerUser(payload: RegisterUserPayload) {
  const firstName = payload.fullName.trim().split(/\s+/)[0] ?? payload.fullName.trim();

  const response = await apiRequest<RegisterUserApiResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      fname: firstName,
      mobile: getSaudiMobileForApi(payload.phone),
      password: payload.password,
    }),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    return {
      ok: false,
      error: response.error || response.data?.message || "Something went wrong",
    } as const;
  }

  return {
    ok: true,
    phone: payload.phone,
    message: response.data?.message,
  } as const;
}
