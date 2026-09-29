"use server";

import type { SavePropertyApiResponse } from "@/features/create-contract/types/save-property-api";
import { apiRequest } from "@/lib/api/api-request";

type SavePropertyPayload = {
  contractId: number;
  nameRealEstate: string;
};

export async function saveProperty({
  contractId,
  nameRealEstate,
}: SavePropertyPayload) {
  const response = await apiRequest<SavePropertyApiResponse>("/save/property", {
    method: "POST",
    body: JSON.stringify({
      contract_id: contractId,
      name_real_estate: nameRealEstate,
    }),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    console.error("[saveProperty] backend rejected save", {
      status: response.status,
      data: response.data,
      error: response.error,
    });

    return {
      ok: false as const,
      error:
        response.error ||
        response.data?.message ||
        "Failed to save property data",
    };
  }

  return {
    ok: true as const,
    message: response.data.message,
  };
}
