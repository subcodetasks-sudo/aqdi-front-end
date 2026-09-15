"use client";

import type { ReactNode } from "react";

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
  hasDiscount?: boolean;
  totalPrice?: number;
  discountedPrice?: number | null;
  selectedMethod?: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void | Promise<void>;
  payNowExtra?: ReactNode;
};

export default function ContractPaymentMethodFlowDialogs({
  labels,
  isMethodDialogOpen,
  onMethodDialogOpenChange,
  isDraftSuccessDialogOpen,
  onDraftSuccessDialogOpenChange,
  draftOrderUuid,
  isSubmitting = false,
  hasDiscount = false,
  totalPrice = 0,
  discountedPrice = null,
  selectedMethod = null,
  onSelect,
  payNowExtra,
}: ContractPaymentMethodFlowDialogsProps) {
  return (
    <>
      <CreateContractPaymentMethodDialog
        labels={labels.methodDialog}
        open={isMethodDialogOpen}
        onOpenChange={onMethodDialogOpenChange}
        isSubmitting={isSubmitting}
        hasDiscount={hasDiscount}
        totalPrice={totalPrice}
        discountedPrice={discountedPrice}
        selectedMethod={selectedMethod}
        onSelect={onSelect}
        payNowExtra={payNowExtra}
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
