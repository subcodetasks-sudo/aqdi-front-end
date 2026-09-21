"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import {
  contractFinancialKeys,
  contractFinanceSummaryKeys,
} from "@/features/create-contract/query-keys";
import { submitContractStep6 } from "@/features/create-contract/services/submit-contract-step6";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { FinanceDataState } from "@/features/create-contract/types/finance-step";

type SubmitContractStep6Input = {
  financeData: FinanceDataState;
};

export function useSubmitContractStep6() {
  const t = useTranslations("createContract.finance");
  const queryClient = useQueryClient();
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep5Data = useCreateContractDraftStore((state) => state.contractStep5Data);
  const contractStep6Data = useCreateContractDraftStore((state) => state.contractStep6Data);
  const setContractStep6Data = useCreateContractDraftStore(
    (state) => state.setContractStep6Data,
  );
  const setContractFinancialData = useCreateContractDraftStore(
    (state) => state.setContractFinancialData,
  );
  const setContractFinanceSummaryData = useCreateContractDraftStore(
    (state) => state.setContractFinanceSummaryData,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitStep6({
    financeData,
  }: SubmitContractStep6Input): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    const contractId =
      contractSession?.contractId ??
      contractStep5Data?.contract_id ??
      contractStep6Data?.contract_id;

    if (!contractId) {
      toast.error(t("missingContractSession"));
      return false;
    }

    if (contractStep6Data && contractStep6Data.step >= 7) {
      return true;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContractStep6({
        contractId,
        financeData,
      });

      if (!result.ok) {
        toast.error(result.error || t("submitError"));
        return false;
      }

      setContractStep6Data(result.data);

      if (result.financial) {
        setContractFinancialData(result.financial);
        setContractFinanceSummaryData(result.financial);

        const uuid = result.data.uuid || contractSession?.uuid;
        if (uuid) {
          queryClient.setQueryData(
            contractFinanceSummaryKeys.detail(uuid),
            result.financial,
          );
          queryClient.setQueryData(
            contractFinancialKeys.detail(uuid),
            result.financial,
          );
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: contractFinanceSummaryKeys.detail(uuid),
            }),
            queryClient.invalidateQueries({
              queryKey: contractFinancialKeys.detail(uuid),
            }),
          ]);
        }
      }

      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitStep6,
    isSubmitting,
  };
}
