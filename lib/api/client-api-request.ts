import {
  BASE_URL,
  WEBSITE_CLIENT_HEADER,
  WEBSITE_CLIENT_ID,
  WEBSITE_CLOSED_PATH,
} from "@/lib/api/constants";
import {
  clearClientAuthTokens,
  getClientAccessToken,
  getClientRefreshToken,
  setClientAuthTokens,
} from "@/lib/api/client-token-storage";
import { requestClientTokenRefresh } from "@/lib/api/client-refresh-token";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { isWebsiteClosedResponse } from "@/lib/api/is-website-closed-response";
import type { ApiResponse } from "@/lib/api/types";

// Public/self-referential endpoints must never trigger the 401 refresh flow —
// retrying them on 401 would either loop (refresh-token) or misreport an
// auth failure that isn't one (login/signup/forgot-password).
const REFRESH_EXCLUDED_ENDPOINTS = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh-token",
  "/auth/forgot-password",
];

function isRefreshExcluded(endpoint: string): boolean {
  return REFRESH_EXCLUDED_ENDPOINTS.some((excluded) =>
    endpoint.startsWith(excluded),
  );
}

// Module-level so concurrent 401s across callers share one refresh instead of
// each rotating (and invalidating) the refresh token out from under the others.
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getClientRefreshToken();

      if (!refreshToken) {
        clearClientAuthTokens();
        return null;
      }

      const tokens = await requestClientTokenRefresh(refreshToken);

      if (!tokens) {
        clearClientAuthTokens();
        return null;
      }

      setClientAuthTokens(tokens);
      return tokens.token;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

async function performFetch(
  endpoint: string,
  options: RequestInit,
  token: string | null,
): Promise<{ response: Response; data: unknown } | null> {
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    [WEBSITE_CLIENT_HEADER]: WEBSITE_CLIENT_ID,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await response.json().catch(() => null);
    return { response, data };
  } catch {
    return null;
  }
}

/**
 * Browser counterpart to `apiRequest` (server-only) for client components
 * that call the API directly instead of going through a server action.
 * Tokens live in localStorage (see client-token-storage) rather than the
 * httpOnly cookie the server layer uses. On a 401, a single shared refresh
 * runs and the original request is retried once with the new access token.
 */
export async function clientApiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  let token = getClientAccessToken();

  const first = await performFetch(endpoint, options, token);

  if (!first) {
    return { ok: false, status: 500, error: "Network error" };
  }

  let { response, data } = first;

  if (isWebsiteClosedResponse(response.status, data)) {
    if (typeof window !== "undefined") {
      window.location.href = WEBSITE_CLOSED_PATH;
    }
    return { ok: false, status: response.status, error: getErrorMessage(data) };
  }

  if (response.status === 401 && !isRefreshExcluded(endpoint)) {
    token = await refreshAccessToken();

    if (!token) {
      redirectToLogin();
      return { ok: false, status: 401, error: getErrorMessage(data) };
    }

    const retried = await performFetch(endpoint, options, token);

    if (!retried) {
      return { ok: false, status: 500, error: "Network error" };
    }

    ({ response, data } = retried);
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: getErrorMessage(data),
    };
  }

  return { ok: true, status: response.status, data: data as T };
}
