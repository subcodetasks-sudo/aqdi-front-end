import {
  BASE_URL,
  WEBSITE_CLIENT_HEADER,
  WEBSITE_CLIENT_ID,
} from "@/lib/api/constants";
import type { AuthTokenPayload } from "@/features/auth/types/auth-user";
import type { RefreshTokenApiResponse } from "@/features/auth/types/refresh-token";

/**
 * Public endpoint: no Authorization header, and the refresh token is only
 * ever sent in the body — never as a Bearer token.
 */
export async function requestClientTokenRefresh(
  refreshToken: string,
): Promise<AuthTokenPayload | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        [WEBSITE_CLIENT_HEADER]: WEBSITE_CLIENT_ID,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = (await response
      .json()
      .catch(() => null)) as RefreshTokenApiResponse | null;

    if (!response.ok || !data?.success || !data.data) {
      return null;
    }

    return data.data;
  } catch {
    return null;
  }
}
