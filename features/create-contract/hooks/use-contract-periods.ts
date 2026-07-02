"use client";

import { useQuery } from "@tanstack/react-query";

import { contractLocationKeys } from "@/features/create-contract/query-keys";
import { getContractPeriods } from "@/features/create-contract/services/get-contract-periods";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export function useContractPeriods(contractType: PropertyContractType) {
  return useQuery({
    queryKey: contractLocationKeys.contractPeriods(contractType),
    queryFn: () => getContractPeriods(contractType),
  });
}
