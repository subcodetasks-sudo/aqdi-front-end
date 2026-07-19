"use client";

import { isFinanceDataComplete } from "@/features/create-contract/types/finance-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useCreateContractFinanceStep() {
  const financeData = useCreateContractDraftStore((state) => state.financeData);
  const setFinanceData = useCreateContractDraftStore((state) => state.setFinanceData);
  const canContinue = isFinanceDataComplete(financeData);

  return {
    financeData,
    setFinanceData,
    canContinue,
  };
}
