"use server";

import { clearAuthToken } from "@/actions/auth";
import { apiRequest } from "@/lib/api/api-request";

type DeleteAccountApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

export async function deleteAccount() {
  const response = await apiRequest<DeleteAccountApiResponse>("/account", {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Something went wrong",
    };
  }

  await clearAuthToken();

  return {
    ok: true as const,
    message: response.data.message,
  };
}
