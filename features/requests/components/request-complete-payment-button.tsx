"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";

import ContractPaymentMethodFlowDialogs from "@/features/create-contract/components/contract-payment-method-flow-dialogs";
import { useContractPaymentMethodFlow } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import type { ContractPaymentMethodLabels } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import { contractFinanceSummaryKeys } from "@/features/create-contract/query-keys";
import { getContractFinanceSummary } from "@/features/create-contract/services/get-contract-finance-summary";
import { formatPaymentAmount } from "@/features/create-contract/types/payment-step";
import { cn } from "@/lib/utils";

type RequestCompletePaymentButtonProps = {
  contractId: number;
  contractUuid: string;
  label: string;
  labelWithAmount: string;
  payingLabel: string;
  paymentFlowLabels: ContractPaymentMethodLabels;
  className?: string;
};

export default function RequestCompletePaymentButton({
  contractId,
  contractUuid,
  label,
  labelWithAmount,
  payingLabel,
  paymentFlowLabels,
  className,
}: RequestCompletePaymentButtonProps) {
  const paymentFlow = useContractPaymentMethodFlow(
    contractId,
    contractUuid,
    paymentFlowLabels,
  );

  const financeQuery = useQuery({
    queryKey: contractFinanceSummaryKeys.detail(contractUuid),
    queryFn: () => getContractFinanceSummary(contractUuid),
    enabled: Boolean(contractUuid),
  });

  const totalPrice = financeQuery.data?.total_price;
  const hasAmount =
    typeof totalPrice === "number" && Number.isFinite(totalPrice);
  const idleLabel = hasAmount
    ? labelWithAmount.replaceAll("{amount}", formatPaymentAmount(totalPrice))
    : label;

  return (
    <>
      <button
        type="button"
        onClick={paymentFlow.openMethodDialog}
        disabled={paymentFlow.isSubmitting}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
      >
        <CreditCard className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">
          {paymentFlow.isSubmitting ? payingLabel : idleLabel}
        </span>
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
