"use client";

import { useState } from "react";
import { toast } from "sonner";

import { saveContractDraft } from "@/features/create-contract/services/save-contract-draft";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

type SaveContractDraftResult =
  | { ok: true; id: number; uuid: string }
  | { ok: false; error: string };

export function useSaveContractDraft() {
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep1Data = useCreateContractDraftStore((state) => state.contractStep1Data);
  const [isSaving, setIsSaving] = useState(false);

  async function saveDraft(): Promise<SaveContractDraftResult> {
    if (isSaving) {
      return { ok: false, error: "" };
    }

    const contractId =
      contractSession?.contractId ?? contractStep1Data?.contract_id;

    if (!contractId) {
      return { ok: false, error: "missingContractSession" };
    }

    setIsSaving(true);

    try {
      const result = await saveContractDraft(contractId);

      if (!result.ok) {
        return {
          ok: false,
          error: result.error || "submitError",
        };
      }

      const id = result.data?.id ?? contractId;
      const uuid = result.data?.uuid ?? contractSession?.uuid ?? String(contractId);

      return { ok: true, id, uuid };
    } finally {
      setIsSaving(false);
    }
  }

  return {
    saveDraft,
    isSaving,
  };
}
