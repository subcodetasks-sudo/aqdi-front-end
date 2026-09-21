"use client";

import { useQuery } from "@tanstack/react-query";

import { propertyLookupKeys } from "@/features/create-property/query-keys";
import { getRealEstateTypes } from "@/features/create-property/services/get-real-estate-types";
import { getRealEstateUsages } from "@/features/create-property/services/get-real-estate-usages";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export function usePropertyTypeOptions(contractType: PropertyContractType) {
  return useQuery({
    queryKey: propertyLookupKeys.types(contractType),
    queryFn: () => getRealEstateTypes(contractType),
  });
}

export function usePropertyUsageOptions(contractType: PropertyContractType) {
  return useQuery({
    queryKey: propertyLookupKeys.usages(contractType),
    queryFn: () => getRealEstateUsages(contractType),
  });
}
