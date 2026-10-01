"use server";

import { apiRequest } from "@/lib/api/api-request";
import { WEBSITE_CLIENT_ID } from "@/lib/api/constants";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type RegisterUserPayload = {
  fullName: string;
  phone: string;
};

type RegisterUserApiData = {
  id: number;
  fname: string;
  mobile: string;
  verified: boolean;
  status: boolean;
};

type RegisterUserApiResponse = {
  message?: string;
  success: boolean;
  data?: RegisterUserApiData;
};

export async function registerUser(payload: RegisterUserPayload) {
  const response = await apiRequest<RegisterUserApiResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      fname: payload.fullName.trim(),
      mobile: getSaudiMobileForApi(payload.phone),
      platform: WEBSITE_CLIENT_ID,
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
