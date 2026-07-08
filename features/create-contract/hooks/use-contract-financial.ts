"use client";

import { useQuery } from "@tanstack/react-query";

import { contractFinancialKeys } from "@/features/create-contract/query-keys";
import { getContractFinancial } from "@/features/create-contract/services/get-contract-financial";

export function useContractFinancial(contractId: number | null) {
  return useQuery({
    queryKey: contractFinancialKeys.detail(contractId ?? 0),
    queryFn: () => getContractFinancial(contractId as number),
    enabled: contractId !== null,
  });
}
