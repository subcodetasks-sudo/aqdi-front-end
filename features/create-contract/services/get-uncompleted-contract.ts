"use server";

import type {
  UncompletedContractApiResponse,
  UncompletedContractData,
} from "@/features/create-contract/types/uncompleted-contract";
import { apiRequest } from "@/lib/api/api-request";

export async function getUncompletedContract(uuid: string): Promise<
  | { ok: true; data: UncompletedContractData }
  | { ok: false; error: string }
> {
  const response = await apiRequest<UncompletedContractApiResponse>(
    "/contract/uncompleted-contract",
    {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify({ uuid }),
    },
  );

  if (!response.ok || !response.data?.success || !response.data.data) {
    return {
      ok: false,
      error:
        response.error ||
        response.data?.message ||
        "Failed to load contract",
    };
  }

  return { ok: true, data: response.data.data };
}
