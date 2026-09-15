"use server";

import { apiRequest } from "@/lib/api/api-request";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type VerifyResetPasswordCodePayload = {
  phone: string;
  code: string;
};

type VerifyResetPasswordCodeApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

export async function verifyResetPasswordCode(
  payload: VerifyResetPasswordCodePayload,
) {
  const response = await apiRequest<VerifyResetPasswordCodeApiResponse>(
    "/auth/reset-password-code",
    {
      method: "POST",
      body: JSON.stringify({
        mobile: getSaudiMobileForApi(payload.phone),
        code: payload.code,
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
    message: response.data.message,
  } as const;
}
