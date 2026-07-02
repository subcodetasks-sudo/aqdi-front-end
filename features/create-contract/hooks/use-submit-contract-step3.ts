"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { submitContractStep3 } from "@/features/create-contract/services/submit-contract-step3";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type {
  AgentDataState,
  OwnerDataState,
} from "@/features/create-contract/types/owner-step";

type SubmitContractStep3Input = {
  ownerData: OwnerDataState;
  agentData: AgentDataState;
};

export function useSubmitContractStep3() {
  const t = useTranslations("createContract.owner");
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep2Data = useCreateContractDraftStore((state) => state.contractStep2Data);
  const contractStep3Data = useCreateContractDraftStore((state) => state.contractStep3Data);
  const setContractStep3Data = useCreateContractDraftStore(
    (state) => state.setContractStep3Data,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitStep3({
    ownerData,
    agentData,
  }: SubmitContractStep3Input): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    const contractId =
      contractSession?.contractId ??
      contractStep2Data?.contract_id ??
      contractStep3Data?.contract_id;

    if (!contractId) {
      toast.error(t("missingContractSession"));
      return false;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContractStep3({
        contractId,
        ownerData,
        agentData,
      });

      if (!result.ok) {
        toast.error(result.error || t("submitError"));
        return false;
      }

      setContractStep3Data(result.data);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitStep3,
    isSubmitting,
  };
}
