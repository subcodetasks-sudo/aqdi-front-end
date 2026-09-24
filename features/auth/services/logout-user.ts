"use server";

import { clearAuthToken, getRefreshToken } from "@/actions/auth";
import { apiRequest } from "@/lib/api/api-request";

type LogoutApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

type LogoutUserPayload = {
  fcmToken?: string | null;
  refreshToken?: string | null;
};

export async function logoutUser(payload: LogoutUserPayload = {}) {
  const body: Record<string, string> = {};

  const refreshToken = (await getRefreshToken()) ?? payload.refreshToken;

  if (refreshToken) {
    body.refresh_token = refreshToken;
  }

  if (payload.fcmToken) {
    body.fcm_token = payload.fcmToken;
  }

  const response = await apiRequest<LogoutApiResponse>("/auth/logout", {
    method: "POST",
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (response.ok && response.data?.success) {
    await clearAuthToken();

    return {
      ok: true,
      message: response.data.message,
    } as const;
  }

  if (response.status === 401) {
    await clearAuthToken();

    return {
      ok: true,
      message: response.data?.message,
    } as const;
  }

  return {
    ok: false,
    error: response.error || response.data?.message || "Something went wrong",
  } as const;
}
