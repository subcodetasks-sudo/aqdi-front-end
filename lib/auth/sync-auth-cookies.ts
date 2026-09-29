import type { NextRequest, NextResponse } from "next/server";

import type { AuthTokenPayload } from "@/features/auth/types/auth-user";
import {
  AUTH_REFRESH_TOKEN_COOKIE,
  AUTH_REMEMBER_ME_COOKIE,
  AUTH_TOKEN_COOKIE,
  AUTH_TOKEN_EXPIRES_AT_COOKIE,
} from "@/lib/api/constants";
import { requestTokenRefresh } from "@/lib/api/refresh-token";
import {
  applyAuthCookies,
  clearAuthCookies,
  isAccessTokenStale,
} from "@/lib/auth/auth-cookies";

function writeRequestCookieHeader(request: NextRequest): void {
  const cookieHeader = request.cookies
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (cookieHeader) {
    request.headers.set("cookie", cookieHeader);
    return;
  }

  request.headers.delete("cookie");
}

/**
 * If the access token is missing or about to expire, exchange the refresh
 * cookie for a new pair and forward the updated cookies to this request so
 * Server Components see the new access token.
 */
export async function syncAuthCookies(request: NextRequest): Promise<{
  accessToken: string | undefined;
  apply: (response: NextResponse) => void;
}> {
  let accessToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(AUTH_REFRESH_TOKEN_COOKIE)?.value;
  const expiresAt = request.cookies.get(AUTH_TOKEN_EXPIRES_AT_COOKIE)?.value;
  const rememberMe = request.cookies.get(AUTH_REMEMBER_ME_COOKIE)?.value === "1";

  let tokensToSet: AuthTokenPayload | null = null;
  let shouldClear = false;

  const needsRefresh =
    Boolean(refreshToken) &&
    (!accessToken || isAccessTokenStale(expiresAt));

  if (needsRefresh && refreshToken) {
    const result = await requestTokenRefresh(refreshToken);

    if (result.ok) {
      tokensToSet = result.tokens;
      accessToken = result.tokens.token;
      request.cookies.set(AUTH_TOKEN_COOKIE, result.tokens.token);
      request.cookies.set(AUTH_REFRESH_TOKEN_COOKIE, result.tokens.refresh_token);
      request.cookies.set(
        AUTH_TOKEN_EXPIRES_AT_COOKIE,
        result.tokens.token_expires_at,
      );
      writeRequestCookieHeader(request);
    } else if (result.terminal) {
      // Refresh token was rejected. A network blip must not wipe the session;
      // a concurrent caller that already rotated this token gets the cached
      // success above instead of landing here.
      shouldClear = true;
      accessToken = undefined;
      request.cookies.delete(AUTH_TOKEN_COOKIE);
      request.cookies.delete(AUTH_REFRESH_TOKEN_COOKIE);
      request.cookies.delete(AUTH_TOKEN_EXPIRES_AT_COOKIE);
      request.cookies.delete(AUTH_REMEMBER_ME_COOKIE);
      writeRequestCookieHeader(request);
    }
  }

  return {
    accessToken,
    apply(response) {
      if (tokensToSet) {
        applyAuthCookies(response.cookies, tokensToSet, rememberMe);
        return;
      }

      if (shouldClear) {
        clearAuthCookies(response.cookies);
      }
    },
  };
}
