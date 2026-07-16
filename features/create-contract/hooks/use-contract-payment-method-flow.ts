"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { PaymentMethod } from "@/features/create-contract/components/create-contract-payment-method-dialog";
import { useStartContractPayment } from "@/features/create-contract/hooks/use-start-contract-payment";
import { saveContractDraft } from "@/features/create-contract/services/save-contract-draft";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type ContractPaymentMethodLabels = {
  methodDialog: CreateContractLabels["payment"]["methodDialog"];
  draftSuccessDialog: CreateContractLabels["payment"]["draftSuccessDialog"];
  payError: string;
};

export function useContractPaymentMethodFlow(
  contractId: number | null | undefined,
  contractUuid: string | null | undefined,
  labels: ContractPaymentMethodLabels,
) {
  const { startPayment, isPaying } = useStartContractPayment();
  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false);
  const [isDraftSuccessDialogOpen, setIsDraftSuccessDialogOpen] = useState(false);
  const [draftOrderUuid, setDraftOrderUuid] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const isSubmitting = isPaying || isSavingDraft;

  function openMethodDialog() {
    if (!contractUuid?.trim()) {
      toast.error(labels.payError);
      return;
    }

    setIsMethodDialogOpen(true);
  }

  async function handlePaymentMethodSelect(method: PaymentMethod) {
    if (method === "draft") {
      if (!contractId) {
        toast.error(labels.methodDialog.missingContractSession);
        return;
      }

      setIsSavingDraft(true);

      try {
        const result = await saveContractDraft(contractId);

        if (!result.ok) {
          toast.error(result.error || labels.methodDialog.draftError);
          return;
        }

        setIsMethodDialogOpen(false);
        setDraftOrderUuid(result.data?.uuid ?? contractUuid ?? null);
        setIsDraftSuccessDialogOpen(true);
      } finally {
        setIsSavingDraft(false);
      }

      return;
    }

    if (!contractUuid?.trim()) {
      toast.error(labels.payError);
      return;
    }

    setIsMethodDialogOpen(false);
    await startPayment(contractUuid, labels.payError);
  }

  return {
    isMethodDialogOpen,
    setIsMethodDialogOpen,
    isDraftSuccessDialogOpen,
    setIsDraftSuccessDialogOpen,
    draftOrderUuid,
    isSubmitting,
    openMethodDialog,
    handlePaymentMethodSelect,
  };
}

export type { ContractPaymentMethodLabels };
