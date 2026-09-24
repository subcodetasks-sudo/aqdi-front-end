import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  isGuestOnlyRoute,
  isProtectedRoute,
} from "@/lib/auth/auth-routes";
import { syncAuthCookies } from "@/lib/auth/sync-auth-cookies";

export async function middleware(request: NextRequest) {
  const { accessToken, apply } = await syncAuthCookies(request);
  const { pathname } = request.nextUrl;

  let response: NextResponse;

  if (!accessToken && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    const callbackUrl = `${pathname}${request.nextUrl.search}`;
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    response = NextResponse.redirect(loginUrl);
  } else if (accessToken && isGuestOnlyRoute(pathname)) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    response = NextResponse.redirect(homeUrl);
  } else {
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  apply(response);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
