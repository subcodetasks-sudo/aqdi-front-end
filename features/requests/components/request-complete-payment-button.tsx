"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";

import { useStartContractPayment } from "@/features/create-contract/hooks/use-start-contract-payment";
import { contractFinanceSummaryKeys } from "@/features/create-contract/query-keys";
import { getContractFinanceSummary } from "@/features/create-contract/services/get-contract-finance-summary";
import { getContractFinancialPayable } from "@/features/create-contract/types/contract-financial";
import { formatContractMoneyAmount } from "@/features/create-contract/utils/format-contract-money";
import { cn } from "@/lib/utils";

type RequestCompletePaymentButtonProps = {
  contractId: number;
  contractUuid: string;
  label: string;
  labelWithAmount: string;
  payingLabel: string;
  paymentFlowLabels: {
    payError: string;
  };
  className?: string;
};

export default function RequestCompletePaymentButton({
  contractUuid,
  label,
  labelWithAmount,
  payingLabel,
  paymentFlowLabels,
  className,
}: RequestCompletePaymentButtonProps) {
  const { startPayment, isPaying } = useStartContractPayment();

  const financeQuery = useQuery({
    queryKey: contractFinanceSummaryKeys.detail(contractUuid),
    queryFn: () => getContractFinanceSummary(contractUuid),
    enabled: Boolean(contractUuid),
  });

  const payableTotal = financeQuery.data
    ? getContractFinancialPayable(financeQuery.data)
    : null;
  const hasAmount =
    typeof payableTotal === "number" && Number.isFinite(payableTotal);
  const idleLabel = hasAmount
    ? labelWithAmount.replaceAll(
        "{amount}",
        formatContractMoneyAmount(payableTotal),
      )
    : label;

  return (
    <button
      type="button"
      onClick={() => void startPayment(contractUuid, paymentFlowLabels.payError)}
      disabled={isPaying}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <CreditCard className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">
        {isPaying ? (
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          idleLabel
        )}
      </span>
    </button>
  );
}
