"use server";

import { apiRequest } from "@/lib/api/api-request";

type DeleteContractApiResponse = {
  message: string;
  code: number;
  success: boolean;
};

export async function deleteContract(contractId: number) {
  const response = await apiRequest<DeleteContractApiResponse>(
    `/contracts/${contractId}`,
    {
      method: "DELETE",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error:
        response.error || response.data?.message || "Failed to delete contract",
    };
  }

  return {
    ok: true as const,
    message: response.data.message,
  };
}
