"use server";

import { cookies } from "next/headers";

import {
  AUTH_TOKEN_COOKIE,
  AUTH_TOKEN_MAX_AGE,
} from "@/lib/api/constants";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function setAuthToken(
  token: string,
  rememberMe = false,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { maxAge: AUTH_TOKEN_MAX_AGE } : {}),
  });
}

export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return Boolean(token);
}
