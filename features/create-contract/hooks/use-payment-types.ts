"use client";

import { useQuery } from "@tanstack/react-query";

import { contractPaymentTypeKeys } from "@/features/create-contract/query-keys";
import { getPaymentTypes } from "@/features/create-contract/services/get-payment-types";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export function usePaymentTypes(contractType: PropertyContractType) {
  return useQuery({
    queryKey: contractPaymentTypeKeys.list(contractType),
    queryFn: () => getPaymentTypes(contractType),
  });
}
