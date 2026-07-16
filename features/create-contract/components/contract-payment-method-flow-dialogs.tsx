"use client";

import CreateContractDraftSuccessDialog from "@/features/create-contract/components/create-contract-draft-success-dialog";
import CreateContractPaymentMethodDialog from "@/features/create-contract/components/create-contract-payment-method-dialog";
import type { ContractPaymentMethodLabels } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import type { PaymentMethod } from "@/features/create-contract/components/create-contract-payment-method-dialog";

type ContractPaymentMethodFlowDialogsProps = {
  labels: ContractPaymentMethodLabels;
  isMethodDialogOpen: boolean;
  onMethodDialogOpenChange: (open: boolean) => void;
  isDraftSuccessDialogOpen: boolean;
  onDraftSuccessDialogOpenChange: (open: boolean) => void;
  draftOrderUuid: string | null;
  isSubmitting?: boolean;
  onSelect: (method: PaymentMethod) => void | Promise<void>;
};

export default function ContractPaymentMethodFlowDialogs({
  labels,
  isMethodDialogOpen,
  onMethodDialogOpenChange,
  isDraftSuccessDialogOpen,
  onDraftSuccessDialogOpenChange,
  draftOrderUuid,
  isSubmitting = false,
  onSelect,
}: ContractPaymentMethodFlowDialogsProps) {
  return (
    <>
      <CreateContractPaymentMethodDialog
        labels={labels.methodDialog}
        open={isMethodDialogOpen}
        onOpenChange={onMethodDialogOpenChange}
        isSubmitting={isSubmitting}
        onSelect={onSelect}
      />

      <CreateContractDraftSuccessDialog
        labels={labels.draftSuccessDialog}
        open={isDraftSuccessDialogOpen}
        onOpenChange={onDraftSuccessDialogOpenChange}
        orderUuid={draftOrderUuid}
      />
    </>
  );
}
