"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { contractFinanceSummaryKeys } from "@/features/create-contract/query-keys";
import { getContractFinanceSummary } from "@/features/create-contract/services/get-contract-finance-summary";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useContractFinanceSummary(contractUuid: string | null) {
  const setContractFinanceSummaryData = useCreateContractDraftStore(
    (state) => state.setContractFinanceSummaryData,
  );

  const query = useQuery({
    queryKey: contractFinanceSummaryKeys.detail(contractUuid ?? ""),
    queryFn: () => getContractFinanceSummary(contractUuid as string),
    enabled: Boolean(contractUuid),
  });

  useEffect(() => {
    if (query.data) {
      setContractFinanceSummaryData(query.data);
    }
  }, [query.data, setContractFinanceSummaryData]);

  return query;
}
