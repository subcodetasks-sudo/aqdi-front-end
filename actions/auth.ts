// Server-only helpers (not server actions): exporting these from a "use server"
// module would make them callable from the browser, and `getToken` would hand
// the httpOnly auth cookie to client JavaScript.
import "server-only";

import { cookies } from "next/headers";

import type { AuthTokenPayload } from "@/features/auth/types/auth-user";
import {
  AUTH_REFRESH_TOKEN_COOKIE,
  AUTH_REMEMBER_ME_COOKIE,
  AUTH_TOKEN_COOKIE,
} from "@/lib/api/constants";
import {
  applyAuthCookies,
  clearAuthCookies,
  getAuthCookieOptions,
} from "@/lib/auth/auth-cookies";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function getRememberMe(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_REMEMBER_ME_COOKIE)?.value === "1";
}

export async function setAuthToken(
  token: string,
  rememberMe = false,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_TOKEN_COOKIE, token, getAuthCookieOptions(rememberMe));
}

export async function setAuthTokens(
  tokens: AuthTokenPayload,
  rememberMe = false,
): Promise<void> {
  const cookieStore = await cookies();
  applyAuthCookies(cookieStore, tokens, rememberMe);
}

export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  clearAuthCookies(cookieStore);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return Boolean(token);
}
