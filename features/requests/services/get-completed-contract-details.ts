"use server";

import type {
  ContractFinancialApiResponse,
  ContractFinancialData,
} from "@/features/create-contract/types/contract-financial";
import type {
  CompletedContractApiResponse,
  CompletedContractData,
} from "@/features/requests/types/completed-contract";
import { apiRequest } from "@/lib/api/api-request";

export type CompletedContractDetails = {
  contract: CompletedContractData;
  financial: ContractFinancialData | null;
};

export type GetCompletedContractDetailsResult =
  | { ok: true; data: CompletedContractDetails }
  | { ok: false; error: string };

export async function getCompletedContractDetails(
  contractId: number,
  uuid: string,
): Promise<GetCompletedContractDetailsResult> {
  const [contractResponse, financialResponse] = await Promise.all([
    apiRequest<CompletedContractApiResponse>(`/contracts/${contractId}`, {
      method: "GET",
      cache: "no-store",
    }),
    apiRequest<ContractFinancialApiResponse>(`/financial/${uuid}`, {
      method: "GET",
      cache: "no-store",
    }),
  ]);

  if (
    !contractResponse.ok ||
    !contractResponse.data?.success ||
    !contractResponse.data.data
  ) {
    return {
      ok: false,
      error:
        contractResponse.error ||
        contractResponse.data?.message ||
        "Failed to load contract",
    };
  }

  const financial =
    financialResponse.ok && financialResponse.data?.status === "success"
      ? (financialResponse.data.data ?? null)
      : null;

  return {
    ok: true,
    data: {
      contract: contractResponse.data.data,
      financial,
    },
  };
}
