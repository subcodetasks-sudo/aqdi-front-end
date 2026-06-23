import type { BirthDateValue } from "@/features/create-contract/types/owner-step";
import { EMPTY_BIRTH_DATE } from "@/features/create-contract/types/owner-step";

export const CONTRACT_DURATION_OPTIONS = [
  "one-year",
  "two-years",
  "three-years",
  "four-years",
  "five-years",
] as const;

export type ContractDurationOption =
  (typeof CONTRACT_DURATION_OPTIONS)[number];

export const PAYMENT_METHOD_OPTIONS = [
  "monthly",
  "quarterly",
  "semi-annual",
  "annual",
] as const;

export type PaymentMethodOption = (typeof PAYMENT_METHOD_OPTIONS)[number];

export const TENANT_PERMISSION_OPTIONS = [
  "sublease",
  "modifications",
  "government-review",
  "renovations",
] as const;

export type TenantPermissionOption =
  (typeof TENANT_PERMISSION_OPTIONS)[number];

export type TenantPermissionsState = Record<TenantPermissionOption, boolean>;

export const DEFAULT_TENANT_PERMISSIONS: TenantPermissionsState = {
  sublease: false,
  modifications: true,
  "government-review": false,
  renovations: false,
};

export type FinanceDataState = {
  contractStartDate: BirthDateValue;
  contractDuration: ContractDurationOption | "";
  totalRentAmount: string;
  paymentMethod: PaymentMethodOption | "";
  addTenantPermissions: boolean;
  addOtherConditions: boolean;
  tenantPermissions: TenantPermissionsState;
  otherConditionsText: string;
};

export const EMPTY_FINANCE_DATA: FinanceDataState = {
  contractStartDate: { ...EMPTY_BIRTH_DATE, calendarType: "gregorian" },
  contractDuration: "",
  totalRentAmount: "",
  paymentMethod: "",
  addTenantPermissions: true,
  addOtherConditions: false,
  tenantPermissions: { ...DEFAULT_TENANT_PERMISSIONS },
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
  return (
    isContractStartDateComplete(financeData.contractStartDate) &&
    financeData.contractDuration !== "" &&
    isRentAmountComplete(financeData.totalRentAmount) &&
    financeData.paymentMethod !== ""
  );
}
