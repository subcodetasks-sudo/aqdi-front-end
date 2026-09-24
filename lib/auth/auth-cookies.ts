import type { AuthTokenPayload } from "@/features/auth/types/auth-user";
import {
  AUTH_REFRESH_TOKEN_COOKIE,
  AUTH_REMEMBER_ME_COOKIE,
  AUTH_TOKEN_COOKIE,
  AUTH_TOKEN_EXPIRES_AT_COOKIE,
  AUTH_TOKEN_MAX_AGE,
} from "@/lib/api/constants";

const ACCESS_TOKEN_REFRESH_SKEW_MS = 30_000;

export type AuthCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge?: number;
};

export function getAuthCookieOptions(rememberMe: boolean): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { maxAge: AUTH_TOKEN_MAX_AGE } : {}),
  };
}

export function isAccessTokenStale(expiresAt: string | undefined): boolean {
  if (!expiresAt) return false;

  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) return false;

  return expiresAtMs - ACCESS_TOKEN_REFRESH_SKEW_MS <= Date.now();
}

type CookieWriter = {
  set: (name: string, value: string, options?: AuthCookieOptions) => void;
  delete: (name: string) => void;
};

export function applyAuthCookies(
  cookies: CookieWriter,
  tokens: AuthTokenPayload,
  rememberMe: boolean,
): void {
  const options = getAuthCookieOptions(rememberMe);

  cookies.set(AUTH_TOKEN_COOKIE, tokens.token, options);
  cookies.set(AUTH_REFRESH_TOKEN_COOKIE, tokens.refresh_token, options);
  cookies.set(AUTH_TOKEN_EXPIRES_AT_COOKIE, tokens.token_expires_at, options);

  if (rememberMe) {
    cookies.set(AUTH_REMEMBER_ME_COOKIE, "1", options);
    return;
  }

  cookies.delete(AUTH_REMEMBER_ME_COOKIE);
}

export function clearAuthCookies(cookies: CookieWriter): void {
  cookies.delete(AUTH_TOKEN_COOKIE);
  cookies.delete(AUTH_REFRESH_TOKEN_COOKIE);
  cookies.delete(AUTH_TOKEN_EXPIRES_AT_COOKIE);
  cookies.delete(AUTH_REMEMBER_ME_COOKIE);
}
