"use client";

import { useQuery } from "@tanstack/react-query";

import { contractPaperworkKeys } from "@/features/create-contract/query-keys";
import { getPaperwork } from "@/features/create-contract/services/get-paperwork";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export function usePaperwork(contractType: PropertyContractType) {
  return useQuery({
    queryKey: contractPaperworkKeys.list(contractType),
    queryFn: () => getPaperwork(contractType),
  });
}
