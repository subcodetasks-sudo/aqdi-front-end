"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";

import { useStartContractPayment } from "@/features/create-contract/hooks/use-start-contract-payment";

type RequestCompletePaymentButtonProps = {
  contractUuid: string;
  label: string;
  payingLabel: string;
  errorLabel: string;
};

export default function RequestCompletePaymentButton({
  contractUuid,
  label,
  payingLabel,
  errorLabel,
}: RequestCompletePaymentButtonProps) {
  const { startPayment, isPaying } = useStartContractPayment();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (isLoading || isPaying) {
      return;
    }

    setIsLoading(true);

    try {
      await startPayment(contractUuid, errorLabel);
    } finally {
      setIsLoading(false);
    }
  }

  const isDisabled = isLoading || isPaying;

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isDisabled}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-l from-brand-secondary to-brand px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CreditCard className="size-4" aria-hidden="true" />
      {isDisabled ? payingLabel : label}
    </button>
  );
}
