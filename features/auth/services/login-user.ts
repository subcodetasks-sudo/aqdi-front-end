"use server";

import { setAuthTokens } from "@/actions/auth";
import { apiRequest } from "@/lib/api/api-request";
import type { AuthUser, LoginApiResponse } from "@/features/auth/types/auth-user";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type LoginUserPayload = {
  phone: string;
  otpCode: string;
  rememberMe: boolean;
  fcmToken?: string | null;
};

export async function loginUser(payload: LoginUserPayload) {
  const response = await apiRequest<LoginApiResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      mobile: getSaudiMobileForApi(payload.phone),
      otp_code: payload.otpCode,
      ...(payload.fcmToken ? { fcm_token: payload.fcmToken } : {}),
    }),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success || !response.data.data) {
    return {
      ok: false,
      error: response.error || response.data?.message || "Something went wrong",
    } as const;
  }

  const { user: apiUser, login_notification: loginNotification, ...tokens } =
    response.data.data;

  const user: AuthUser = {
    ...apiUser,
    name: apiUser.name || apiUser.fname,
    full_name: apiUser.full_name || apiUser.fname,
    phone: apiUser.phone || apiUser.mobile,
  };

  await setAuthTokens(tokens, payload.rememberMe);

  return {
    ok: true,
    message: response.data.message,
    user,
    tokens,
    loginNotification: loginNotification ?? null,
  } as const;
}
