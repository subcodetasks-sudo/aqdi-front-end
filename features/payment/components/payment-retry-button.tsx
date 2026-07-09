"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useStartContractPayment } from "@/features/create-contract/hooks/use-start-contract-payment";
import type { ContractPaymentStatusSource } from "@/features/create-contract/services/get-contract-payment-status";

type PaymentRetryButtonProps = {
  contractUuid: string;
  source?: ContractPaymentStatusSource;
  label: string;
  payingLabel: string;
  errorLabel: string;
};

export default function PaymentRetryButton({
  contractUuid,
  source = "contract",
  label,
  payingLabel,
  errorLabel,
}: PaymentRetryButtonProps) {
  const { startPayment, isPaying } = useStartContractPayment();
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = isLoading || isPaying;

  async function handleClick() {
    if (isDisabled) {
      return;
    }

    setIsLoading(true);

    try {
      await startPayment(contractUuid, errorLabel, source);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={() => void handleClick()}
      disabled={isDisabled}
      className="h-12 w-full rounded-xl bg-linear-to-br from-brand-secondary via-brand to-brand text-sm font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CreditCard className="size-4" aria-hidden="true" />
      {isDisabled ? payingLabel : label}
    </Button>
  );
}
