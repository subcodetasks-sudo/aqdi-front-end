"use client";

import { useState } from "react";
import { toast } from "sonner";

import { getContractPaymentUrl } from "@/features/create-contract/services/get-contract-payment-url";
import type { ContractPaymentStatusSource } from "@/features/create-contract/services/get-contract-payment-status";

export function useStartContractPayment() {
  const [isPaying, setIsPaying] = useState(false);

  async function startPayment(
    contractUuid: string,
    errorLabel: string,
    _source: ContractPaymentStatusSource = "contract",
  ): Promise<boolean> {
    if (isPaying || !contractUuid.trim()) {
      return false;
    }

    setIsPaying(true);

    try {
      const result = await getContractPaymentUrl(contractUuid);

      if (!result.ok) {
        toast.error(result.error || errorLabel);
        return false;
      }

      window.location.assign(result.data.paymentUrl);
      return true;
    } finally {
      setIsPaying(false);
    }
  }

  return {
    startPayment,
    isPaying,
  };
}
