import type { ContractTypeId } from "@/features/create-contract/types/contract-type";

import type { AppliedContractCoupon } from "@/features/create-contract/types/contract-coupon";
import { formatContractMoneyAmount } from "@/features/create-contract/utils/format-contract-money";

export type PaymentDataState = {
  savePropertyData: boolean;
  propertyName: string;
  appliedCoupon: AppliedContractCoupon | null;
};

export const EMPTY_PAYMENT_DATA: PaymentDataState = {
  savePropertyData: false,
  propertyName: "",
  appliedCoupon: null,
};

/** @deprecated Use formatContractMoneyAmount — kept for callers expecting a number string. */
export function formatPaymentAmount(amount: number) {
  return formatContractMoneyAmount(amount);
}

/** @deprecated Hardcoded fallbacks removed; financial amounts come from the API. */
export type PaymentBreakdown = {
  ejarFees: number;
  contractPeriodPrice: number;
  vat: number;
  applicationFees: number;
  total: number;
};

/** @deprecated Do not use — fee amounts must come from API `details`. */
export const PAYMENT_BREAKDOWN: Record<ContractTypeId, PaymentBreakdown> = {
  residential: {
    ejarFees: 0,
    contractPeriodPrice: 0,
    vat: 0,
    applicationFees: 0,
    total: 0,
  },
  commercial: {
    ejarFees: 0,
    contractPeriodPrice: 0,
    vat: 0,
    applicationFees: 0,
    total: 0,
  },
};
