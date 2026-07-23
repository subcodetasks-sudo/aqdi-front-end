import type { FinanceDataState } from "@/features/create-contract/types/finance-step";
import { getFilledOtherConditions } from "@/features/create-contract/types/finance-step";
import { buildStep6TenantPayload } from "@/features/create-contract/utils/tenant-role-helpers";
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

  const tenantPayload = buildStep6TenantPayload(
    financeData.selectedTenantRoleIds,
    financeData.tenantRoleValues,
  );

  const body: Record<
    string,
    string | number | boolean | number[] | string[] | Record<string, string>
  > = {
    id: contractId,
    type_contract_starting_date: contractStartDate.calendarType,
    contract_starting_date_day: formatPropertyOwnerDatePart(contractStartDate.day),
    contract_starting_date_month: formatPropertyOwnerDatePart(
      contractStartDate.month,
    ),
    contract_starting_date_year: formatPropertyOwnerYear(contractStartDate.year),
    payment_type_id: financeData.paymentTypeId,
    conditions: financeData.addOtherConditions,
    tenant_roles: tenantPayload.tenant_roles,
    additional_terms: financeData.addOtherConditions,
  };

  if (financeData.isCustomDuration && hasCustomDuration) {
    body.duration_preset = "other";
    body.duration_years = financeData.customDurationYears;
    body.duration_months = financeData.customDurationMonths;
  } else {
    body.contract_term_in_years = financeData.contractPeriodId as number;
  }

  if (tenantPayload.tenant_role_ids.length > 0) {
    body.tenant_role_ids = tenantPayload.tenant_role_ids;
  }

  if (Object.keys(tenantPayload.tenant_role_values).length > 0) {
    body.tenant_role_values = tenantPayload.tenant_role_values;
  }

  if (financeData.addOtherConditions) {
    const otherConditionsList = getFilledOtherConditions(
      financeData.otherConditionsList,
    );

    if (otherConditionsList.length === 0) {
      throw new Error("At least one other condition is required");
    }

    body.other_conditions_list = otherConditionsList;
  }

  return body;
}
