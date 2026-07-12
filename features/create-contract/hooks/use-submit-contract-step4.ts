"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { submitContractStep4 } from "@/features/create-contract/services/submit-contract-step4";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { TenantDataState } from "@/features/create-contract/types/tenant-step";

type SubmitContractStep4Input = {
  tenantData: TenantDataState;
  isLeaseRenewal?: boolean;
  notes?: string;
};

export function useSubmitContractStep4() {
  const t = useTranslations("createContract.tenant");
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep3Data = useCreateContractDraftStore((state) => state.contractStep3Data);
  const contractStep4Data = useCreateContractDraftStore((state) => state.contractStep4Data);
  const setContractStep4Data = useCreateContractDraftStore(
    (state) => state.setContractStep4Data,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitStep4({
    tenantData,
    isLeaseRenewal = false,
    notes,
  }: SubmitContractStep4Input): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    const contractId =
      contractSession?.contractId ??
      contractStep3Data?.contract_id ??
      contractStep4Data?.contract_id;

    if (!contractId) {
      toast.error(t("missingContractSession"));
      return false;
    }

    if (contractStep4Data && contractStep4Data.step >= 5) {
      return true;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContractStep4({
        contractId,
        tenantData,
        isLeaseRenewal,
        notes,
      });

      if (!result.ok) {
        toast.error(result.error || t("submitError"));
        return false;
      }

      setContractStep4Data(result.data);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitStep4,
    isSubmitting,
  };
}
