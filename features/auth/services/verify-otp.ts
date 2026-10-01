"use server";

import { apiRequest } from "@/lib/api/api-request";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type VerifyOtpPayload = {
  phone: string;
  verificationCode: string;
};

type VerifyOtpApiResponse = {
  message?: string;
  success: boolean;
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

  return {
    ok: true,
    message: response.data.message,
  } as const;
}
