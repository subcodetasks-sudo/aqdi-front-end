"use server";

import { apiRequest } from "@/lib/api/api-request";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type ForgotPasswordPayload = {
  phone: string;
};

type ForgotPasswordApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

export async function requestForgotPassword(payload: ForgotPasswordPayload) {
  const response = await apiRequest<ForgotPasswordApiResponse>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({
        mobile: getSaudiMobileForApi(payload.phone),
      }),
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false,
      error: response.error || response.data?.message || "Something went wrong",
    } as const;
  }

  return {
    ok: true,
    phone: payload.phone,
    message: response.data.message,
  } as const;
}
