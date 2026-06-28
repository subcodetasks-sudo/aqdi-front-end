"use server";

import { apiRequest } from "@/lib/api/api-request";

type UpdatePasswordPayload = {
  password: string;
  passwordConfirmation: string;
};

type UpdatePasswordApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

export async function updatePassword(payload: UpdatePasswordPayload) {
  const response = await apiRequest<UpdatePasswordApiResponse>("/update/password", {
    method: "POST",
    body: JSON.stringify({
      password: payload.password,
      password_confirmation: payload.passwordConfirmation,
    }),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    return {
      ok: false,
      error: response.error || response.data?.message || "Something went wrong",
    } as const;
  }

  return {
    ok: true,
    message: response.data.message,
  } as const;
}
