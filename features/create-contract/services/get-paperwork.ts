"use server";

import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type {
  PaperworkApiResponse,
  PaperworkItem,
} from "@/features/create-contract/types/paperwork";
import { apiRequest } from "@/lib/api/api-request";

export async function getPaperwork(
  contractType: PropertyContractType,
): Promise<PaperworkItem[]> {
  const response = await apiRequest<PaperworkApiResponse>(
    `/paperwork?contract_type=${contractType}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch paperwork",
    );
  }

  return response.data.data;
}
