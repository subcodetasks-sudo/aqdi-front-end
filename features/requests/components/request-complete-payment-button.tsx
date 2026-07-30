"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";

import ContractPaymentMethodFlowDialogs from "@/features/create-contract/components/contract-payment-method-flow-dialogs";
import CreateContractDiscountCodeField from "@/features/create-contract/components/create-contract-discount-code-field";
import { useApplyContractCoupon } from "@/features/create-contract/hooks/use-apply-contract-coupon";
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
  const { appliedCoupon, isApplying, applyCoupon, clearCouponDraft } =
    useApplyContractCoupon(contractUuid);

  const financeQuery = useQuery({
    queryKey: contractFinanceSummaryKeys.detail(contractUuid),
    queryFn: () => getContractFinanceSummary(contractUuid),
    enabled: Boolean(contractUuid),
  });

  const totalPrice =
    appliedCoupon?.totalPriceBeforeCoupon ?? financeQuery.data?.total_price;
  const payableTotal =
    appliedCoupon?.totalPriceAfterCoupon ?? financeQuery.data?.total_price;
  const hasDiscount =
    Boolean(appliedCoupon) &&
    typeof appliedCoupon?.discount === "number" &&
    appliedCoupon.discount > 0;
  const hasAmount =
    typeof payableTotal === "number" && Number.isFinite(payableTotal);
  const idleLabel = hasAmount
    ? labelWithAmount.replaceAll("{amount}", formatPaymentAmount(payableTotal))
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
          {paymentFlow.isSubmitting ? (
            <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
          ) : (
            idleLabel
          )}
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
        hasDiscount={hasDiscount}
        totalPrice={typeof totalPrice === "number" ? totalPrice : 0}
        discountedPrice={
          hasDiscount ? (appliedCoupon?.totalPriceAfterCoupon ?? null) : null
        }
        selectedMethod={paymentFlow.selectedPaymentMethod}
        onSelect={paymentFlow.handlePaymentMethodSelect}
        payNowExtra={
          <CreateContractDiscountCodeField
            labels={paymentFlowLabels.discountCode}
            appliedCoupon={appliedCoupon}
            isApplying={isApplying}
            onApply={applyCoupon}
            onClear={clearCouponDraft}
          />
        }
      />
    </>
  );
}
