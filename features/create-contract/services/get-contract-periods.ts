"use server";

import type { ContractPeriodsApiResponse } from "@/features/create-contract/types/contract-period";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { apiRequest } from "@/lib/api/api-request";

export async function getContractPeriods(contractType: PropertyContractType) {
  const response = await apiRequest<ContractPeriodsApiResponse>(
    `/contract-periods?contract_type=${contractType}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch contract periods",
    );
  }

  return response.data.data;
}
