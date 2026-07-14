import type { FinanceDataState } from "@/features/create-contract/types/finance-step";
import {
  formatPropertyOwnerDatePart,
  formatPropertyOwnerYear,
} from "@/features/create-property/utils/property-owner-api";

export type ContractStep6Payload = {
  contractId: number;
  financeData: FinanceDataState;
};

export function buildContractStep6Body({
  contractId,
  financeData,
}: ContractStep6Payload) {
  const { contractStartDate } = financeData;

  if (financeData.paymentTypeId === "") {
    throw new Error("Payment type is required");
  }

  const hasPresetDuration = financeData.contractPeriodId !== "";
  const hasCustomDuration =
    financeData.isCustomDuration &&
    typeof financeData.customDurationYears === "number" &&
    typeof financeData.customDurationMonths === "number";

  if (!hasPresetDuration && !hasCustomDuration) {
    throw new Error("Contract duration is required");
  }

  const body: Record<string, string | number | boolean | number[]> = {
    id: contractId,
    type_contract_starting_date: contractStartDate.calendarType,
    contract_starting_date_day: formatPropertyOwnerDatePart(contractStartDate.day),
    contract_starting_date_month: formatPropertyOwnerDatePart(
      contractStartDate.month,
    ),
    contract_starting_date_year: formatPropertyOwnerYear(contractStartDate.year),
    payment_type_id: financeData.paymentTypeId,
    conditions: financeData.addOtherConditions,
    tenant_roles: financeData.addTenantPermissions,
    additional_terms: financeData.addOtherConditions,
  };

  if (financeData.isCustomDuration && hasCustomDuration) {
    body.duration_preset = "other";
    body.duration_years = financeData.customDurationYears;
    body.duration_months = financeData.customDurationMonths;
  } else {
    body.contract_term_in_years = financeData.contractPeriodId as number;
  }

  if (financeData.addTenantPermissions && financeData.selectedTenantRoleIds.length > 0) {
    if (financeData.selectedTenantRoleIds.length === 1) {
      body.tenant_role_id = financeData.selectedTenantRoleIds[0];
    } else {
      body.tenant_role_ids = financeData.selectedTenantRoleIds;
    }
  }

  return body;
}
