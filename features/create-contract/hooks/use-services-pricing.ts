"use client";

import { useQuery } from "@tanstack/react-query";

import { contractServicesPricingKeys } from "@/features/create-contract/query-keys";
import { getServicesPricing } from "@/features/create-contract/services/get-services-pricing";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export function useServicesPricing(contractType: PropertyContractType) {
  return useQuery({
    queryKey: contractServicesPricingKeys.list(contractType),
    queryFn: () => getServicesPricing(contractType),
  });
}
