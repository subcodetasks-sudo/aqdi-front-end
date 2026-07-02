import type { BirthDateValue } from "@/features/create-contract/types/owner-step";
import { EMPTY_BIRTH_DATE } from "@/features/create-contract/types/owner-step";

export const PAYMENT_METHOD_OPTIONS = [
  "monthly",
  "quarterly",
  "semi-annual",
  "annual",
] as const;

export type PaymentMethodOption = (typeof PAYMENT_METHOD_OPTIONS)[number];

export type FinanceDataState = {
  contractStartDate: BirthDateValue;
  contractPeriodId: number | "";
  totalRentAmount: string;
  paymentMethod: PaymentMethodOption | "";
  addTenantPermissions: boolean;
  addOtherConditions: boolean;
  selectedTenantRoleIds: number[];
  otherConditionsText: string;
};

export const EMPTY_FINANCE_DATA: FinanceDataState = {
  contractStartDate: { ...EMPTY_BIRTH_DATE, calendarType: "hijri" },
  contractPeriodId: "",
  totalRentAmount: "",
  paymentMethod: "",
  addTenantPermissions: false,
  addOtherConditions: false,
  selectedTenantRoleIds: [],
  otherConditionsText: "",
};

function isContractStartDateComplete(contractStartDate: BirthDateValue) {
  return (
    contractStartDate.day !== "" &&
    contractStartDate.month !== "" &&
    contractStartDate.year !== ""
  );
}

function isRentAmountComplete(totalRentAmount: string) {
  const digits = totalRentAmount.replace(/\D/g, "");
  return digits.length > 0 && Number(digits) > 0;
}

export function isFinanceDataComplete(financeData: FinanceDataState) {
  const baseComplete =
    isContractStartDateComplete(financeData.contractStartDate) &&
    financeData.contractPeriodId !== "" &&
    isRentAmountComplete(financeData.totalRentAmount) &&
    financeData.paymentMethod !== "";

  if (!baseComplete) {
    return false;
  }

  if (
    financeData.addTenantPermissions &&
    financeData.selectedTenantRoleIds.length === 0
  ) {
    return false;
  }

  if (
    financeData.addOtherConditions &&
    financeData.otherConditionsText.trim() === ""
  ) {
    return false;
  }

  return true;
}
