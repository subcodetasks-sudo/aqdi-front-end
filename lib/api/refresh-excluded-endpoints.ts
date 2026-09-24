// Public/self-referential endpoints must never trigger the 401 refresh flow —
// retrying them on 401 would either loop (refresh-token) or misreport an
// auth failure that isn't one (login/signup/forgot-password).
const REFRESH_EXCLUDED_ENDPOINTS = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/logout",
];

export function isRefreshExcluded(endpoint: string): boolean {
  return REFRESH_EXCLUDED_ENDPOINTS.some((excluded) =>
    endpoint.startsWith(excluded),
  );
}
