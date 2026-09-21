"use server";

import type {
  ContractFinancialApiResponse,
  ContractFinancialData,
} from "@/features/create-contract/types/contract-financial";
import { parseContractFinancialData } from "@/features/create-contract/utils/parse-contract-financial";
import { apiRequest } from "@/lib/api/api-request";

export async function getContractFinancial(
  contractUuid: string,
): Promise<ContractFinancialData> {
  const response = await apiRequest<ContractFinancialApiResponse>(
    `/financial/${contractUuid}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || response.data?.status !== "success" || !response.data.data) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch contract financial details",
    );
  }

  const parsed = parseContractFinancialData(response.data.data);
  if (!parsed) {
    throw new Error("Invalid contract financial payload");
  }

  return parsed;
}
