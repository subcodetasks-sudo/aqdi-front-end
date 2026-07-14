import type { BirthDateValue } from "@/features/create-contract/types/owner-step";
import { getTodayContractStartDate } from "@/features/create-contract/utils/get-today-contract-start-date";

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

export function createEmptyFinanceData(): FinanceDataState {
  return {
    contractStartDate: getTodayContractStartDate("hijri"),
    contractPeriodId: "",
    totalRentAmount: "",
    paymentTypeId: "",
    addTenantPermissions: false,
    addOtherConditions: false,
    selectedTenantRoleIds: [],
    otherConditionsText: "",
  };
}

export const EMPTY_FINANCE_DATA: FinanceDataState = createEmptyFinanceData();

const LEGACY_PAYMENT_METHOD_TO_TYPE_ID: Record<string, number> = {
  monthly: 1,
  quarterly: 2,
  "semi-annual": 3,
  annual: 4,
};

function resolveContractStartDate(
  contractStartDate: BirthDateValue | undefined,
): BirthDateValue {
  const calendarType = contractStartDate?.calendarType ?? "hijri";

  if (
    !contractStartDate ||
    (contractStartDate.day === "" &&
      contractStartDate.month === "" &&
      contractStartDate.year === "")
  ) {
    return getTodayContractStartDate(calendarType);
  }

  return contractStartDate;
}

export function normalizeFinanceData(
  financeData: Partial<FinanceDataState> & { paymentMethod?: string },
): FinanceDataState {
  let paymentTypeId = financeData.paymentTypeId ?? "";

  if (paymentTypeId === "" && financeData.paymentMethod) {
    paymentTypeId =
      LEGACY_PAYMENT_METHOD_TO_TYPE_ID[financeData.paymentMethod] ?? "";
  }

  return {
    ...createEmptyFinanceData(),
    ...financeData,
    contractStartDate: resolveContractStartDate(financeData.contractStartDate),
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
