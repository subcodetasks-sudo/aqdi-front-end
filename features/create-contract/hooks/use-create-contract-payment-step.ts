"use client";

import { useState } from "react";

import {
  EMPTY_PAYMENT_DATA,
  type PaymentDataState,
} from "@/features/create-contract/types/payment-step";

export function useCreateContractPaymentStep() {
  const [paymentData, setPaymentData] =
    useState<PaymentDataState>(EMPTY_PAYMENT_DATA);

  return {
    paymentData,
    setPaymentData,
  };
}
