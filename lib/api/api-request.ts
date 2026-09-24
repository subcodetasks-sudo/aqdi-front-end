// Server-only (not a server action): as a "use server" export, apiRequest would
// be an open proxy that attaches the user's bearer token to any endpoint.
import "server-only";

import { redirect } from "next/navigation";

import { clearAuthToken, getToken } from "@/actions/auth";
import {
  BASE_URL,
  WEBSITE_CLIENT_HEADER,
  WEBSITE_CLIENT_ID,
  WEBSITE_CLOSED_PATH,
} from "@/lib/api/constants";
import { compressFormDataImages } from "@/lib/api/image-utils";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { isRefreshExcluded } from "@/lib/api/refresh-excluded-endpoints";
import { refreshServerAccessToken } from "@/lib/api/server-refresh-access-token";
import type { ApiResponse } from "@/lib/api/types";
import { isWebsiteClosedResponse } from "@/lib/api/is-website-closed-response";

function buildAuthHeaders(token: string | null, isFormData: boolean): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    // Identifies the web SPA so the backend serves the "website closed" 503.
    // Mobile clients must not send this.
    [WEBSITE_CLIENT_HEADER]: WEBSITE_CLIENT_ID,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function performFetch(
  endpoint: string,
  options: RequestInit | undefined,
  token: string | null,
  isFormData: boolean,
): Promise<{ response: Response; data: unknown } | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...buildAuthHeaders(token, isFormData),
        ...(options?.headers || {}),
      },
    });

    const data = await response.json().catch(() => null);
    return { response, data };
  } catch {
    return null;
  }
}

async function sendAuthorizedRequest<T>(
  endpoint: string,
  options: RequestInit | undefined,
  isFormData: boolean,
): Promise<ApiResponse<T>> {
  let token = await getToken();
  let result = await performFetch(endpoint, options, token, isFormData);

  if (!result) {
    return {
      ok: false,
      status: 500,
      error: "Network error",
    };
  }

  // Interceptor: the website was closed for maintenance mid-session — send the
  // user to the full-screen closed page. Kept outside the try block so the
  // redirect error is not swallowed.
  if (isWebsiteClosedResponse(result.response.status, result.data)) {
    redirect(WEBSITE_CLOSED_PATH);
  }

  if (result.response.status === 401 && !isRefreshExcluded(endpoint)) {
    token = await refreshServerAccessToken();

    if (!token) {
      return {
        ok: false,
        status: 401,
        error: getErrorMessage(result.data),
      };
    }

    result = await performFetch(endpoint, options, token, isFormData);

    if (!result) {
      return {
        ok: false,
        status: 500,
        error: "Network error",
      };
    }

    if (isWebsiteClosedResponse(result.response.status, result.data)) {
      redirect(WEBSITE_CLOSED_PATH);
    }
  }

  if (!result.response.ok) {
    if (result.response.status === 401) {
      await clearAuthToken();
    }

    return {
      ok: false,
      status: result.response.status,
      error: getErrorMessage(result.data),
    };
  }

  return {
    ok: true,
    status: result.response.status,
    data: result.data as T,
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const isFormData = options?.body instanceof FormData;
  let requestOptions = options;

  if (isFormData && options?.body instanceof FormData) {
    requestOptions = {
      ...options,
      body: await compressFormDataImages(options.body),
    };
  }

  return sendAuthorizedRequest<T>(endpoint, requestOptions, isFormData);
}

export async function apiFormDataRequest<T>(
  endpoint: string,
  formData: FormData,
  method: string = "POST",
): Promise<ApiResponse<T>> {
  const compressedFormData = await compressFormDataImages(formData);

  return sendAuthorizedRequest<T>(
    endpoint,
    {
      method,
      body: compressedFormData,
    },
    true,
  );
}
