"use server";

import { getToken } from "@/actions/auth";
import { BASE_URL } from "@/lib/api/constants";
import { compressFormDataImages } from "@/lib/api/image-utils";
import { getErrorMessage } from "@/lib/api/get-error-message";
import type { ApiResponse } from "@/lib/api/types";

function buildAuthHeaders(token: string | null, isFormData: boolean): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const token = await getToken();
  const isFormData = options?.body instanceof FormData;
  let requestOptions = options;

  if (isFormData && options?.body instanceof FormData) {
    const formData = await compressFormDataImages(options.body);
    requestOptions = {
      ...options,
      body: formData,
    };
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...requestOptions,
      headers: {
        ...buildAuthHeaders(token, isFormData),
        ...(requestOptions?.headers || {}),
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: getErrorMessage(data),
      };
    }

    return {
      ok: true,
      status: response.status,
      data: data as T,
    };
  } catch {
    return {
      ok: false,
      status: 500,
      error: "Network error",
    };
  }
}

export async function apiFormDataRequest<T>(
  endpoint: string,
  formData: FormData,
  method: string = "POST",
): Promise<ApiResponse<T>> {
  const token = await getToken();
  const compressedFormData = await compressFormDataImages(formData);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      body: compressedFormData,
      headers: buildAuthHeaders(token, true),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: getErrorMessage(data),
      };
    }

    return {
      ok: true,
      status: response.status,
      data: data as T,
    };
  } catch {
    return {
      ok: false,
      status: 500,
      error: "Network error",
    };
  }
}
