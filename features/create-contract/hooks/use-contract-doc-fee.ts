"use client";

import { useQuery } from "@tanstack/react-query";

import { contractDocFeeKeys } from "@/features/create-contract/query-keys";
import { previewContractDocFee } from "@/features/create-contract/services/preview-contract-doc-fee";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

type UseContractDocFeeParams = {
  contractId: number | null;
  contractType: PropertyContractType;
  years: number | "";
  months: number | "";
  enabled: boolean;
};

export function useContractDocFee({
  contractId,
  contractType,
  years,
  months,
  enabled,
}: UseContractDocFeeParams) {
  const resolvedYears = typeof years === "number" ? years : 0;
  const resolvedMonths = typeof months === "number" ? months : 0;
  const canPreview =
    enabled &&
    resolvedYears >= 1 &&
    resolvedMonths >= 0 &&
    resolvedMonths <= 11 &&
    (contractId !== null || Boolean(contractType));

  return useQuery({
    queryKey: contractDocFeeKeys.preview({
      contractId,
      contractType,
      years: resolvedYears,
      months: resolvedMonths,
    }),
    queryFn: () =>
      previewContractDocFee({
        contractId,
        contractType,
        durationYears: resolvedYears,
        durationMonths: resolvedMonths,
      }),
    enabled: canPreview,
  });
}
