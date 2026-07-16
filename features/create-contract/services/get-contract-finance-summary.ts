"use server";

import type {
  ContractFinancialApiResponse,
  ContractFinancialData,
} from "@/features/create-contract/types/contract-financial";
import { apiRequest } from "@/lib/api/api-request";

export async function getContractFinanceSummary(
  contractUuid: string,
): Promise<ContractFinancialData> {
  const response = await apiRequest<ContractFinancialApiResponse>(
    `/finance-summary/${contractUuid}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || response.data?.status !== "success" || !response.data.data) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch contract finance summary",
    );
  }

  return response.data.data;
}
