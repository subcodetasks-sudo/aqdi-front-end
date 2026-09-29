import "server-only";

import {
  clearAuthToken,
  getRefreshToken,
  getRememberMe,
  setAuthTokens,
} from "@/actions/auth";
import { requestTokenRefresh } from "@/lib/api/refresh-token";

// Module-level so concurrent 401s across callers share one refresh instead of
// each rotating (and invalidating) the refresh token out from under the others.
let refreshPromise: Promise<string | null> | null = null;

export function refreshServerAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        await clearAuthToken();
        return null;
      }

      const result = await requestTokenRefresh(refreshToken);

      if (!result.ok) {
        if (result.terminal) {
          await clearAuthToken();
        }
        return null;
      }

      try {
        await setAuthTokens(result.tokens, await getRememberMe());
      } catch {
        // Server Components cannot persist cookies. The new access token is
        // still returned so this request can retry; middleware is what keeps
        // the next navigation in sync.
      }

      return result.tokens.token;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
