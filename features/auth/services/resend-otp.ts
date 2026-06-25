"use server";

import { apiRequest } from "@/lib/api/api-request";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type ResendOtpPayload = {
  phone: string;
};

type ResendOtpApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

export async function resendOtp(payload: ResendOtpPayload) {
  const response = await apiRequest<ResendOtpApiResponse>("/auth/resend", {
    method: "POST",
    body: JSON.stringify({
      mobile: getSaudiMobileForApi(payload.phone),
    }),
    cache: "no-store",
  });

  if (!response.ok || response.data?.success === false) {
    return {
      ok: false,
      error: response.error || response.data?.message || "Something went wrong",
    } as const;
  }

  return {
    ok: true,
    message: response.data?.message,
  } as const;
}
