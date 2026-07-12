import type { BirthDateValue } from "@/features/create-contract/types/owner-step";
import { EMPTY_BIRTH_DATE } from "@/features/create-contract/types/owner-step";

export type FinanceDataState = {
  contractStartDate: BirthDateValue;
  contractPeriodId: number | "";
  totalRentAmount: string;
  paymentTypeId: number | "";
  addTenantPermissions: boolean;
  addOtherConditions: boolean;
  selectedTenantRoleIds: number[];
  otherConditionsText: string;
};

export const EMPTY_FINANCE_DATA: FinanceDataState = {
  contractStartDate: { ...EMPTY_BIRTH_DATE, calendarType: "hijri" },
  contractPeriodId: "",
  totalRentAmount: "",
  paymentTypeId: "",
  addTenantPermissions: false,
  addOtherConditions: false,
  selectedTenantRoleIds: [],
  otherConditionsText: "",
};

const LEGACY_PAYMENT_METHOD_TO_TYPE_ID: Record<string, number> = {
  monthly: 1,
  quarterly: 2,
  "semi-annual": 3,
  annual: 4,
};

export function normalizeFinanceData(
  financeData: Partial<FinanceDataState> & { paymentMethod?: string },
): FinanceDataState {
  let paymentTypeId = financeData.paymentTypeId ?? "";

  if (paymentTypeId === "" && financeData.paymentMethod) {
    paymentTypeId =
      LEGACY_PAYMENT_METHOD_TO_TYPE_ID[financeData.paymentMethod] ?? "";
  }

  return {
    ...EMPTY_FINANCE_DATA,
    ...financeData,
    paymentTypeId:
      typeof paymentTypeId === "number" && paymentTypeId > 0 ? paymentTypeId : "",
  };
}

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
    financeData.paymentTypeId !== "";

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
