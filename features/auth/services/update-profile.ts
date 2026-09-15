"use server";

import { apiRequest } from "@/lib/api/api-request";
import type { AuthUser } from "@/features/auth/types/auth-user";

type UpdateProfilePayload = {
  fullName: string;
};

type UpdateProfileApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: AuthUser;
};

export async function updateProfile(payload: UpdateProfilePayload) {
  const response = await apiRequest<UpdateProfileApiResponse>("/profile", {
    method: "POST",
    body: JSON.stringify({
      fname: payload.fullName.trim(),
    }),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success || !response.data.data) {
    return {
      ok: false,
      error: response.error || response.data?.message || "Something went wrong",
    } as const;
  }

  return {
    ok: true,
    message: response.data.message,
    user: response.data.data,
  } as const;
}
