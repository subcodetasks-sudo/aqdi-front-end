"use server";

import { apiRequest } from "@/lib/api/api-request";

type PropertyStep3FinishApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: {
    id: number;
    step: number;
  };
};

/** Finish create/update without units — POST { id } only. */
export async function finishPropertyStep3(propertyId: number) {
  const response = await apiRequest<PropertyStep3FinishApiResponse>(
    "/realstate/step3",
    {
      method: "POST",
      body: JSON.stringify({ id: propertyId }),
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Something went wrong",
    };
  }

  return {
    ok: true as const,
    propertyId: response.data.data?.id ?? propertyId,
    message: response.data.message,
  };
}

export async function finishPropertyStep3Update(propertyId: number) {
  const response = await apiRequest<PropertyStep3FinishApiResponse>(
    "/realstate/update/step3",
    {
      method: "POST",
      body: JSON.stringify({ id: propertyId }),
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Something went wrong",
    };
  }

  return {
    ok: true as const,
    propertyId: response.data.data?.id ?? propertyId,
    message: response.data.message,
  };
}
