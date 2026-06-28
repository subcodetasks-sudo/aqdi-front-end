import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  isGuestOnlyRoute,
  isProtectedRoute,
} from "@/lib/auth/auth-routes";
import { AUTH_TOKEN_COOKIE } from "@/lib/api/constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (!token && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isGuestOnlyRoute(pathname)) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
