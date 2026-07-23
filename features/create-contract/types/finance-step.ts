import type { BirthDateValue } from "@/features/create-contract/types/owner-step";
import { areTenantRoleValuesComplete } from "@/features/create-contract/utils/tenant-role-helpers";
import { getTodayContractStartDate } from "@/features/create-contract/utils/get-today-contract-start-date";

export type FinanceDataState = {
  contractStartDate: BirthDateValue;
  contractPeriodId: number | "";
  isCustomDuration: boolean;
  customDurationYears: number | "";
  customDurationMonths: number | "";
  totalRentAmount: string;
  paymentTypeId: number | "";
  addTenantPermissions: boolean;
  addOtherConditions: boolean;
  selectedTenantRoleIds: number[];
  tenantRoleValues: Record<string, string>;
  otherConditionsList: string[];
};

export const MAX_OTHER_CONDITIONS = 50;

export function createEmptyFinanceData(): FinanceDataState {
  return {
    contractStartDate: getTodayContractStartDate("hijri"),
    contractPeriodId: "",
    isCustomDuration: false,
    customDurationYears: "",
    customDurationMonths: "",
    totalRentAmount: "",
    paymentTypeId: "",
    addTenantPermissions: false,
    addOtherConditions: false,
    selectedTenantRoleIds: [],
    tenantRoleValues: {},
    otherConditionsList: [],
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

function resolveOtherConditionsList(
  financeData: Partial<FinanceDataState> & {
    paymentMethod?: string;
    otherConditionsText?: string;
  },
): string[] {
  if (Array.isArray(financeData.otherConditionsList)) {
    return financeData.otherConditionsList
      .slice(0, MAX_OTHER_CONDITIONS)
      .map((item) => (typeof item === "string" ? item : ""));
  }

  const legacyText = financeData.otherConditionsText;
  if (typeof legacyText === "string" && legacyText.trim() !== "") {
    return legacyText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, MAX_OTHER_CONDITIONS);
  }

  return [];
}

export function getFilledOtherConditions(list: string[]) {
  return list.map((item) => item.trim()).filter(Boolean);
}

export function normalizeFinanceData(
  financeData: Partial<FinanceDataState> & {
    paymentMethod?: string;
    otherConditionsText?: string;
  },
): FinanceDataState {
  let paymentTypeId = financeData.paymentTypeId ?? "";

  if (paymentTypeId === "" && financeData.paymentMethod) {
    paymentTypeId =
      LEGACY_PAYMENT_METHOD_TO_TYPE_ID[financeData.paymentMethod] ?? "";
  }

  const otherConditionsList = resolveOtherConditionsList(financeData);

  const selectedTenantRoleIds = Array.isArray(financeData.selectedTenantRoleIds)
    ? financeData.selectedTenantRoleIds.filter(
        (id): id is number => typeof id === "number" && Number.isFinite(id),
      )
    : [];

  const tenantRoleValues =
    financeData.tenantRoleValues &&
    typeof financeData.tenantRoleValues === "object" &&
    !Array.isArray(financeData.tenantRoleValues)
      ? Object.fromEntries(
          Object.entries(financeData.tenantRoleValues).map(([key, value]) => [
            key,
            value == null ? "" : String(value),
          ]),
        )
      : {};

  return {
    ...createEmptyFinanceData(),
    ...financeData,
    contractStartDate: resolveContractStartDate(financeData.contractStartDate),
    isCustomDuration: Boolean(financeData.isCustomDuration),
    customDurationYears:
      typeof financeData.customDurationYears === "number"
        ? financeData.customDurationYears
        : "",
    customDurationMonths:
      typeof financeData.customDurationMonths === "number"
        ? financeData.customDurationMonths
        : "",
    paymentTypeId:
      typeof paymentTypeId === "number" && paymentTypeId > 0 ? paymentTypeId : "",
    selectedTenantRoleIds,
    tenantRoleValues,
    addTenantPermissions:
      financeData.addTenantPermissions === true ||
      selectedTenantRoleIds.length > 0,
    otherConditionsList,
    addOtherConditions:
      financeData.addOtherConditions === true || otherConditionsList.length > 0,
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

function isDurationComplete(financeData: FinanceDataState) {
  if (financeData.isCustomDuration) {
    return (
      typeof financeData.customDurationYears === "number" &&
      financeData.customDurationYears >= 1 &&
      financeData.customDurationYears <= 30 &&
      typeof financeData.customDurationMonths === "number" &&
      financeData.customDurationMonths >= 0 &&
      financeData.customDurationMonths <= 11
    );
  }

  return financeData.contractPeriodId !== "";
}

export function isFinanceDataComplete(financeData: FinanceDataState) {
  const baseComplete =
    isContractStartDateComplete(financeData.contractStartDate) &&
    isDurationComplete(financeData) &&
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
    !areTenantRoleValuesComplete(
      financeData.selectedTenantRoleIds,
      financeData.tenantRoleValues,
    )
  ) {
    return false;
  }

  if (
    financeData.addOtherConditions &&
    getFilledOtherConditions(financeData.otherConditionsList).length === 0
  ) {
    return false;
  }

  return true;
}
