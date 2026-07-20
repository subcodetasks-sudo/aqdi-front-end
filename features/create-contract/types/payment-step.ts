import type { ContractTypeId } from "@/features/create-contract/types/contract-type";

export type PaymentBreakdown = {
  ejarFees: number;
  contractPeriodPrice: number;
  vat: number;
  applicationFees: number;
  total: number;
};

export const PAYMENT_BREAKDOWN: Record<ContractTypeId, PaymentBreakdown> = {
  residential: {
    ejarFees: 125,
    contractPeriodPrice: 124,
    vat: 0,
    applicationFees: 0,
    total: 249,
  },
  commercial: {
    ejarFees: 175,
    contractPeriodPrice: 174,
    vat: 0,
    applicationFees: 0,
    total: 349,
  },
};

export type PaymentDataState = {
  savePropertyData: boolean;
  propertyName: string;
  discountCode: string;
};

export const EMPTY_PAYMENT_DATA: PaymentDataState = {
  savePropertyData: false,
  propertyName: "",
  discountCode: "",
};

export function formatPaymentAmount(amount: number) {
  return amount === 0 ? "00" : amount.toLocaleString("en-US");
}
