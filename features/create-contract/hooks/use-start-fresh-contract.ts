"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { startContract } from "@/features/create-contract/services/start-contract";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import {
  toPropertyContractType,
  type ContractTypeId,
} from "@/features/create-contract/types/contract-type";

export function useStartFreshContract(contractType: ContractTypeId) {
  const t = useTranslations("createContract.intro");
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const setFreshContractSession = useCreateContractDraftStore(
    (state) => state.setFreshContractSession,
  );
  const goNextStep = useCreateContractDraftStore((state) => state.goNextStep);
  const [isStarting, setIsStarting] = useState(false);

  async function handleStart() {
    if (isStarting) {
      return;
    }

    const apiContractType = toPropertyContractType(contractType);

    if (
      contractSession &&
      !contractSession.isReal &&
      contractSession.contractType === apiContractType
    ) {
      goNextStep();
      return;
    }

    setIsStarting(true);

    try {
      const result = await startContract({
        contract_type: apiContractType,
        is_real: false,
      });

      if (!result.ok) {
        toast.error(result.error || t("startContractError"));
        return;
      }

      setFreshContractSession({
        contractId: result.contractId,
        uuid: result.uuid,
        contractType: apiContractType,
        isReal: false,
      });

      goNextStep();
    } finally {
      setIsStarting(false);
    }
  }

  return {
    handleStart,
    isStarting,
  };
}
