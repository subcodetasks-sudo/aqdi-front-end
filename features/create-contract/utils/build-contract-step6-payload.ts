import type { FinanceDataState } from "@/features/create-contract/types/finance-step";
import { getFilledOtherConditions } from "@/features/create-contract/types/finance-step";
import type { TenantRole } from "@/features/create-contract/types/tenant-role";
import {
  buildStep6TenantPayload,
  isDailyFineRole,
  isSecurityDepositRole,
  readTenantRoleAmount,
} from "@/features/create-contract/utils/tenant-role-helpers";
import {
  formatPropertyOwnerDatePart,
  formatPropertyOwnerYear,
} from "@/features/create-property/utils/property-owner-api";

export type ContractStep6Payload = {
  contractId: number;
  financeData: FinanceDataState;
  tenantRoles?: TenantRole[];
};

export function buildContractStep6Body({
  contractId,
  financeData,
  tenantRoles = [],
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
    tenantRoles,
  );
  const otherConditionsList = getFilledOtherConditions(
    financeData.otherConditionsList,
  );
  const hasOtherConditions = otherConditionsList.length > 0;

  const body: Record<
    string,
    string | number | boolean | number[] | string[] | Record<string, string>
  > = {
    id: contractId,
    app_or_web: "web",
    type_contract_starting_date: contractStartDate.calendarType,
    contract_starting_date_day: formatPropertyOwnerDatePart(contractStartDate.day),
    contract_starting_date_month: formatPropertyOwnerDatePart(
      contractStartDate.month,
    ),
    contract_starting_date_year: formatPropertyOwnerYear(contractStartDate.year),
    payment_type_id: financeData.paymentTypeId,
    annual_rent_amount_for_the_unit: Number(
      financeData.totalRentAmount.replace(/\D/g, ""),
    ),
    conditions: hasOtherConditions,
    tenant_roles: tenantPayload.tenant_roles,
    additional_terms: hasOtherConditions,
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

  if (hasOtherConditions) {
    body.other_conditions_list = otherConditionsList;
    body.text_additional_terms = otherConditionsList.join("\n");
  }

  for (const roleId of financeData.selectedTenantRoleIds) {
    const role = tenantRoles.find((item) => item.id === roleId);
    const amount = readTenantRoleAmount(financeData.tenantRoleValues, roleId);
    if (!role || amount == null) {
      continue;
    }

    if (isDailyFineRole(role)) {
      body.daily_fine = amount;
    }

    if (isSecurityDepositRole(role)) {
      body.Guarantee_amount = amount;
    }
  }

  return body;
}
