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
  discountCode: CreateContractLabels["payment"]["discountCode"];
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const isSubmitting = isPaying || isSavingDraft;

  function openMethodDialog() {
    if (!contractUuid?.trim()) {
      toast.error(labels.payError);
      return;
    }

    setIsMethodDialogOpen(true);
  }

  function selectPaymentMethod(method: PaymentMethod) {
    setSelectedPaymentMethod(method);
    setIsMethodDialogOpen(false);
  }

  async function executeSelectedPaymentMethod(
    method: PaymentMethod = selectedPaymentMethod ?? "pay-now",
  ) {
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

    await startPayment(contractUuid, labels.payError);
  }

  async function handlePaymentMethodSelect(method: PaymentMethod) {
    selectPaymentMethod(method);
    await executeSelectedPaymentMethod(method);
  }

  async function handlePrimaryAction() {
    if (!selectedPaymentMethod) {
      openMethodDialog();
      return;
    }

    await executeSelectedPaymentMethod(selectedPaymentMethod);
  }

  return {
    isMethodDialogOpen,
    setIsMethodDialogOpen,
    isDraftSuccessDialogOpen,
    setIsDraftSuccessDialogOpen,
    draftOrderUuid,
    isSubmitting,
    selectedPaymentMethod,
    openMethodDialog,
    selectPaymentMethod,
    handlePaymentMethodSelect,
    handlePrimaryAction,
    executeSelectedPaymentMethod,
  };
}

export type { ContractPaymentMethodLabels };
