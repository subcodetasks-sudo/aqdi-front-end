"use server";

import type {
  ContractDetail,
  ContractDetailApiResponse,
} from "@/features/requests/types/contract-journey";
import { normalizeContractDetail } from "@/features/requests/utils/normalize-contract-status";
import { apiRequest } from "@/lib/api/api-request";

export type GetContractByIdResult =
  | { ok: true; data: ContractDetail }
  | { ok: false; error: string };

export async function getContractById(
  contractId: number,
): Promise<GetContractByIdResult> {
  const response = await apiRequest<ContractDetailApiResponse>(
    `/contracts/${contractId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success || !response.data.data) {
    return {
      ok: false,
      error:
        response.error ||
        response.data?.message ||
        "Failed to fetch contract details",
    };
  }

  return {
    ok: true,
    data: normalizeContractDetail(response.data.data),
  };
}
