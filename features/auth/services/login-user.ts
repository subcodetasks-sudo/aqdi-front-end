"use server";

import { setAuthToken } from "@/actions/auth";
import { apiRequest } from "@/lib/api/api-request";
import type { LoginApiResponse } from "@/features/auth/types/auth-user";
import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type LoginUserPayload = {
  phone: string;
  password: string;
  rememberMe: boolean;
  fcmToken?: string | null;
};

export async function loginUser(payload: LoginUserPayload) {
  const response = await apiRequest<LoginApiResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      mobile: getSaudiMobileForApi(payload.phone),
      password: payload.password,
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

  const { user, token } = response.data.data;

  await setAuthToken(token, payload.rememberMe);

  return {
    ok: true,
    message: response.data.message,
    user,
  } as const;
}
