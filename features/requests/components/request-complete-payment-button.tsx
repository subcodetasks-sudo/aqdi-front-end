"use client";

import { CreditCard } from "lucide-react";

import ContractPaymentMethodFlowDialogs from "@/features/create-contract/components/contract-payment-method-flow-dialogs";
import { useContractPaymentMethodFlow } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import type { ContractPaymentMethodLabels } from "@/features/create-contract/hooks/use-contract-payment-method-flow";

type RequestCompletePaymentButtonProps = {
  contractId: number;
  contractUuid: string;
  label: string;
  payingLabel: string;
  paymentFlowLabels: ContractPaymentMethodLabels;
};

export default function RequestCompletePaymentButton({
  contractId,
  contractUuid,
  label,
  payingLabel,
  paymentFlowLabels,
}: RequestCompletePaymentButtonProps) {
  const paymentFlow = useContractPaymentMethodFlow(
    contractId,
    contractUuid,
    paymentFlowLabels,
  );

  return (
    <>
      <button
        type="button"
        onClick={paymentFlow.openMethodDialog}
        disabled={paymentFlow.isSubmitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-l from-brand-secondary to-brand px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CreditCard className="size-4" aria-hidden="true" />
        {paymentFlow.isSubmitting ? payingLabel : label}
      </button>

      <ContractPaymentMethodFlowDialogs
        labels={paymentFlowLabels}
        isMethodDialogOpen={paymentFlow.isMethodDialogOpen}
        onMethodDialogOpenChange={paymentFlow.setIsMethodDialogOpen}
        isDraftSuccessDialogOpen={paymentFlow.isDraftSuccessDialogOpen}
        onDraftSuccessDialogOpenChange={paymentFlow.setIsDraftSuccessDialogOpen}
        draftOrderUuid={paymentFlow.draftOrderUuid}
        isSubmitting={paymentFlow.isSubmitting}
        onSelect={paymentFlow.handlePaymentMethodSelect}
      />
    </>
  );
}
