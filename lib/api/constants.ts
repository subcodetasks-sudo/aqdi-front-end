export const AUTH_TOKEN_COOKIE = "access_token";

export const AUTH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Client-side (localStorage) token storage keys. These back `clientApiRequest`
 * — the browser-only counterpart to `apiRequest` used by client components
 * that call the API directly instead of through a server action. Separate
 * from `AUTH_TOKEN_COOKIE`, which is the httpOnly cookie the server-side
 * request layer and `middleware.ts` route protection rely on.
 */
export const CLIENT_ACCESS_TOKEN_STORAGE_KEY = "aqdi_token";
export const CLIENT_REFRESH_TOKEN_STORAGE_KEY = "aqdi_refresh_token";
export const CLIENT_TOKEN_EXPIRES_AT_STORAGE_KEY = "aqdi_token_expires_at";
export const CLIENT_REFRESH_TOKEN_EXPIRES_AT_STORAGE_KEY =
  "aqdi_refresh_token_expires_at";

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not set.");
  }

  return baseUrl;
}

export const BASE_URL = getBaseUrl();

/**
 * Marks every request as coming from the web SPA. The backend only returns the
 * "website closed" 503 (see `features/website-status`) when it recognises the
 * caller as the website — mobile clients must never send this.
 */
export const WEBSITE_CLIENT_HEADER = "X-Client";
export const WEBSITE_CLIENT_ID = "website";

/** Route that renders the full-screen maintenance page. */
export const WEBSITE_CLOSED_PATH = "/maintenance";
