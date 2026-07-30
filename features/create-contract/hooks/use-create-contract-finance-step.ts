"use client";

import { isFinanceDataComplete, sanitizeFinanceDataForContinue } from "@/features/create-contract/types/finance-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useCreateContractFinanceStep() {
  const financeData = useCreateContractDraftStore((state) => state.financeData);
  const setFinanceData = useCreateContractDraftStore((state) => state.setFinanceData);
  const canContinue = isFinanceDataComplete(
    sanitizeFinanceDataForContinue(financeData),
  );

  return {
    financeData,
    setFinanceData,
    canContinue,
  };
}
