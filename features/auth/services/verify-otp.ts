"use server";

import { setAuthToken } from "@/actions/auth";
import { apiRequest } from "@/lib/api/api-request";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type VerifyOtpPayload = {
  phone: string;
  verificationCode: string;
};

type VerifyOtpApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: {
    token?: string;
    access_token?: string;
  };
};

export async function verifyOtp(payload: VerifyOtpPayload) {
  const response = await apiRequest<VerifyOtpApiResponse>("/auth/verification", {
    method: "POST",
    body: JSON.stringify({
      mobile: getSaudiMobileForApi(payload.phone),
      verification_code: payload.verificationCode,
    }),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    return {
      ok: false,
      error: response.error || response.data?.message || "Something went wrong",
    } as const;
  }

  const token =
    response.data.data?.token ?? response.data.data?.access_token ?? null;

  if (token) {
    await setAuthToken(token);
  }

  return {
    ok: true,
    message: response.data.message,
    hasToken: Boolean(token),
  } as const;
}
