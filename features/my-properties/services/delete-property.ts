"use server";

import { apiRequest } from "@/lib/api/api-request";

type DeletePropertyApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

export async function deleteProperty(propertyId: number) {
  const response = await apiRequest<DeletePropertyApiResponse>(
    `/realstate/delete/${propertyId}`,
    {
      method: "DELETE",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error:
        response.error || response.data?.message || "Failed to delete property",
    };
  }

  return {
    ok: true as const,
    message: response.data.message,
  };
}
