"use client";

import { useQuery } from "@tanstack/react-query";

import { contractFinancialKeys } from "@/features/create-contract/query-keys";
import { getContractFinancial } from "@/features/create-contract/services/get-contract-financial";

export function useContractFinancial(contractKey: string | number | null) {
  return useQuery({
    queryKey: contractFinancialKeys.detail(contractKey ?? 0),
    queryFn: () => getContractFinancial(contractKey as string | number),
    enabled: contractKey !== null && contractKey !== "",
  });
}
