import type { ContractStep6ApiData } from "@/features/create-contract/types/contract-step6-api";
import {
  createEmptyFinanceData,
  type FinanceDataState,
} from "@/features/create-contract/types/finance-step";
import { getTodayContractStartDate } from "@/features/create-contract/utils/get-today-contract-start-date";

export function buildFinanceDataFromStep6(
  step6: Partial<ContractStep6ApiData> | null | undefined,
  current?: FinanceDataState,
): FinanceDataState {
  const base = current ?? createEmptyFinanceData();

  if (!step6) {
    return base;
  }

  const isCustomDuration = step6.duration_preset === "other";
  const paymentTypeId =
    typeof step6.payment_type_id === "number" && step6.payment_type_id > 0
      ? step6.payment_type_id
      : base.paymentTypeId;

  return {
    ...base,
    contractStartDate:
      base.contractStartDate.day !== ""
        ? base.contractStartDate
        : getTodayContractStartDate(base.contractStartDate.calendarType),
    isCustomDuration,
    contractPeriodId: isCustomDuration
      ? ""
      : typeof step6.contract_term_in_years === "number"
        ? step6.contract_term_in_years
        : base.contractPeriodId,
    customDurationYears: isCustomDuration
      ? typeof step6.duration_years === "number"
        ? step6.duration_years
        : 1
      : base.customDurationYears,
    customDurationMonths: isCustomDuration
      ? typeof step6.duration_months === "number"
        ? step6.duration_months
        : 0
      : base.customDurationMonths,
    paymentTypeId,
    totalRentAmount:
      typeof step6.annual_rent_amount_for_the_unit === "number" &&
      step6.annual_rent_amount_for_the_unit > 0
        ? String(step6.annual_rent_amount_for_the_unit)
        : base.totalRentAmount,
  };
}

export function getDocFeeLinesFromStep6(
  step6: Partial<ContractStep6ApiData> | null | undefined,
): string[] {
  if (!Array.isArray(step6?.doc_fee_lines)) {
    return [];
  }

  return step6.doc_fee_lines.filter((line) => line.trim() !== "");
}
