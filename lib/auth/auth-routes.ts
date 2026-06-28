export const GUEST_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
] as const;

export const PROTECTED_ROUTE_PREFIXES = [
  "/profile",
  "/properties",
  "/requests",
  "/create-contract",
  "/notifications",
] as const;

export function isGuestOnlyRoute(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function getSafeCallbackUrl(callbackUrl: string | null): string {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/";
  }

  return callbackUrl;
}
