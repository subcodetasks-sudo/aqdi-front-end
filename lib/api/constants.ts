export const AUTH_TOKEN_COOKIE = "access_token";

export const AUTH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

/**
 * Marks every request as coming from the web SPA. The backend only returns the
 * "website closed" 503 (see `features/website-status`) when it recognises the
 * caller as the website — mobile clients must never send this.
 */
export const WEBSITE_CLIENT_HEADER = "X-Client";
export const WEBSITE_CLIENT_ID = "website";

/** Route that renders the full-screen maintenance page. */
export const WEBSITE_CLOSED_PATH = "/maintenance";
