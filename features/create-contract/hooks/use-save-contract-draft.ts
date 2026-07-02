"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { saveContractDraft } from "@/features/create-contract/services/save-contract-draft";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useSaveContractDraft() {
  const t = useTranslations("createContract.tenant");
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep1Data = useCreateContractDraftStore((state) => state.contractStep1Data);
  const [isSaving, setIsSaving] = useState(false);

  async function saveDraft(): Promise<{ uuid: string } | null> {
    if (isSaving) {
      return null;
    }

    const contractId =
      contractSession?.contractId ?? contractStep1Data?.contract_id;

    if (!contractId) {
      toast.error(t("missingContractSession"));
      return null;
    }

    setIsSaving(true);

    try {
      const result = await saveContractDraft(contractId);

      if (!result.ok) {
        toast.error(result.error || t("saveLaterError"));
        return null;
      }

      const uuid = contractSession?.uuid ?? String(contractId);

      return { uuid };
    } finally {
      setIsSaving(false);
    }
  }

  return {
    saveDraft,
    isSaving,
  };
}
