"use server";

import { apiRequest } from "@/lib/api/api-request";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type ResetPasswordPayload = {
  phone: string;
  code: string;
  password: string;
  passwordConfirmation: string;
};

type ResetPasswordApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await apiRequest<ResetPasswordApiResponse>(
    "/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify({
        mobile: getSaudiMobileForApi(payload.phone),
        code: payload.code,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
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
