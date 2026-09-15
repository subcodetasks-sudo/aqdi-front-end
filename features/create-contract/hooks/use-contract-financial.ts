"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { contractFinancialKeys } from "@/features/create-contract/query-keys";
import { getContractFinancial } from "@/features/create-contract/services/get-contract-financial";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useContractFinancial(contractUuid: string | null) {
  const setContractFinancialData = useCreateContractDraftStore(
    (state) => state.setContractFinancialData,
  );

  const query = useQuery({
    queryKey: contractFinancialKeys.detail(contractUuid ?? ""),
    queryFn: () => getContractFinancial(contractUuid as string),
    enabled: Boolean(contractUuid),
  });

  useEffect(() => {
    if (query.data) {
      setContractFinancialData(query.data);
    }
  }, [query.data, setContractFinancialData]);

  return query;
}
