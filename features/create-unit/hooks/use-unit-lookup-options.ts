"use client";

import { useQuery } from "@tanstack/react-query";

import { unitKeys } from "@/features/create-unit/query-keys";
import { getUnitTypes } from "@/features/create-unit/services/get-unit-types";
import { getUnitUsageOptions } from "@/features/create-unit/services/get-unit-usage";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export function useUnitTypeOptions(contractType: PropertyContractType) {
  return useQuery({
    queryKey: unitKeys.types(contractType),
    queryFn: () => getUnitTypes(contractType),
  });
}

export function useUnitUsageOptions(contractType: PropertyContractType) {
  return useQuery({
    queryKey: unitKeys.usage(contractType),
    queryFn: () => getUnitUsageOptions(contractType),
  });
}
