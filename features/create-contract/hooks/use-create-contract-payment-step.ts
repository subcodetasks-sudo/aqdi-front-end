"use client";

import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useCreateContractPaymentStep() {
  const paymentData = useCreateContractDraftStore((state) => state.paymentData);
  const setPaymentData = useCreateContractDraftStore((state) => state.setPaymentData);

  return {
    paymentData,
    setPaymentData,
  };
}
