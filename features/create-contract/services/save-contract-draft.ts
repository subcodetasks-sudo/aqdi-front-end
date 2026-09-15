"use server";

import type { ContractDraftApiResponse } from "@/features/create-contract/types/contract-draft-api";
import { apiRequest } from "@/lib/api/api-request";

export async function saveContractDraft(contractId: number) {
  const response = await apiRequest<ContractDraftApiResponse>("/contract/draft", {
    method: "POST",
    body: JSON.stringify({
      id: contractId,
      is_draft: true,
    }),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error:
        response.error ||
        response.data?.message ||
        "Failed to save contract draft",
    };
  }

  return {
    ok: true as const,
    data: response.data.data,
    message: response.data.message,
  };
}
