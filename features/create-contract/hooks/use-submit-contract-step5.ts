"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { submitContractStep5 } from "@/features/create-contract/services/submit-contract-step5";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { RentedUnitDataState } from "@/features/create-contract/types/rented-unit-step";

type SubmitContractStep5Input = {
  rentedUnits: RentedUnitDataState[];
};

export function useSubmitContractStep5() {
  const t = useTranslations("createContract.tenant");
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep4Data = useCreateContractDraftStore((state) => state.contractStep4Data);
  const contractStep5Data = useCreateContractDraftStore((state) => state.contractStep5Data);
  const setContractStep5Data = useCreateContractDraftStore(
    (state) => state.setContractStep5Data,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitStep5({ rentedUnits }: SubmitContractStep5Input): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    const contractId =
      contractSession?.contractId ??
      contractStep4Data?.contract_id ??
      contractStep5Data?.contract_id;

    if (!contractId) {
      toast.error(t("missingContractSession"));
      return false;
    }

    if (contractStep5Data && contractStep5Data.step >= 6) {
      return true;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContractStep5({
        contractId,
        rentedUnits,
      });

      if (!result.ok) {
        toast.error(result.error || t("submitUnitError"));
        return false;
      }

      setContractStep5Data(result.data);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitStep5,
    isSubmitting,
  };
}
