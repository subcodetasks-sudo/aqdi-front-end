import type { AuthTokenPayload } from "@/features/auth/types/auth-user";
import type { RefreshTokenApiResponse } from "@/features/auth/types/refresh-token";
import {
  BASE_URL,
  WEBSITE_CLIENT_HEADER,
  WEBSITE_CLIENT_ID,
} from "@/lib/api/constants";

export type TokenRefreshResult =
  | { ok: true; tokens: AuthTokenPayload }
  | { ok: false; terminal: boolean };

// A rotated refresh token is dead. Requests that still hold the previous
// value must reuse this result instead of exchanging it again and then
// treating the 401 as "log the user out".
const RECENT_REFRESH_MS = 20_000;

type RefreshState = {
  inflight: Map<string, Promise<TokenRefreshResult>>;
  recent: Map<string, { at: number; result: TokenRefreshResult }>;
};

function getRefreshState(): RefreshState {
  const root = globalThis as typeof globalThis & {
    __aqdiTokenRefresh?: RefreshState;
  };

  if (!root.__aqdiTokenRefresh) {
    root.__aqdiTokenRefresh = {
      inflight: new Map(),
      recent: new Map(),
    };
  }

  return root.__aqdiTokenRefresh;
}

async function performTokenRefresh(
  refreshToken: string,
): Promise<TokenRefreshResult> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        [WEBSITE_CLIENT_HEADER]: WEBSITE_CLIENT_ID,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    const data = (await response
      .json()
      .catch(() => null)) as RefreshTokenApiResponse | null;

    const tokens = data?.data;
    if (
      !response.ok ||
      !data?.success ||
      !tokens?.token ||
      !tokens.refresh_token
    ) {
      const terminal =
        response.status === 401 ||
        response.status === 403 ||
        response.status === 422;

      return { ok: false, terminal };
    }

    return { ok: true, tokens };
  } catch {
    return { ok: false, terminal: false };
  }
}

/**
 * Public endpoint: no Authorization header, and the refresh token is only
 * ever sent in the body — never as a Bearer token.
 *
 * One refresh per refresh-token value, shared across middleware and server
 * code in this process. Concurrent callers must not each rotate the token.
 */
export function requestTokenRefresh(
  refreshToken: string,
): Promise<TokenRefreshResult> {
  const state = getRefreshState();
  const cached = state.recent.get(refreshToken);

  if (cached && Date.now() - cached.at < RECENT_REFRESH_MS) {
    return Promise.resolve(cached.result);
  }

  const existing = state.inflight.get(refreshToken);
  if (existing) return existing;

  const promise = performTokenRefresh(refreshToken)
    .then((result) => {
      if (result.ok) {
        const now = Date.now();
        for (const [key, value] of state.recent) {
          if (now - value.at >= RECENT_REFRESH_MS) state.recent.delete(key);
        }
        state.recent.set(refreshToken, { at: now, result });
      }

      return result;
    })
    .finally(() => {
      state.inflight.delete(refreshToken);
    });

  state.inflight.set(refreshToken, promise);
  return promise;
}
