import {
  CLIENT_ACCESS_TOKEN_STORAGE_KEY,
  CLIENT_REFRESH_TOKEN_STORAGE_KEY,
  CLIENT_REFRESH_TOKEN_EXPIRES_AT_STORAGE_KEY,
  CLIENT_TOKEN_EXPIRES_AT_STORAGE_KEY,
} from "@/lib/api/constants";
import type { AuthTokenPayload } from "@/features/auth/types/auth-user";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getClientAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(CLIENT_ACCESS_TOKEN_STORAGE_KEY);
}

export function getClientRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(CLIENT_REFRESH_TOKEN_STORAGE_KEY);
}

export function setClientAuthTokens(tokens: AuthTokenPayload): void {
  if (!isBrowser()) return;

  localStorage.setItem(CLIENT_ACCESS_TOKEN_STORAGE_KEY, tokens.token);
  localStorage.setItem(CLIENT_REFRESH_TOKEN_STORAGE_KEY, tokens.refresh_token);
  localStorage.setItem(
    CLIENT_TOKEN_EXPIRES_AT_STORAGE_KEY,
    tokens.token_expires_at,
  );
  localStorage.setItem(
    CLIENT_REFRESH_TOKEN_EXPIRES_AT_STORAGE_KEY,
    tokens.refresh_token_expires_at,
  );
}

export function clearClientAuthTokens(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(CLIENT_ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(CLIENT_REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(CLIENT_TOKEN_EXPIRES_AT_STORAGE_KEY);
  localStorage.removeItem(CLIENT_REFRESH_TOKEN_EXPIRES_AT_STORAGE_KEY);
}
