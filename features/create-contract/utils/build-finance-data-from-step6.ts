import type { ContractStep6ApiData } from "@/features/create-contract/types/contract-step6-api";
import type { TenantRoleDetail } from "@/features/create-contract/types/tenant-role";
import {
  createEmptyFinanceData,
  getFilledOtherConditions,
  MAX_OTHER_CONDITIONS,
  type FinanceDataState,
} from "@/features/create-contract/types/finance-step";
import { getTodayContractStartDate } from "@/features/create-contract/utils/get-today-contract-start-date";

function resolveOtherConditionsFromStep6(
  step6: Partial<ContractStep6ApiData>,
  fallback: string[],
): string[] {
  if (Array.isArray(step6.other_conditions_list)) {
    const list = getFilledOtherConditions(step6.other_conditions_list).slice(
      0,
      MAX_OTHER_CONDITIONS,
    );

    if (list.length > 0) {
      return list;
    }
  }

  if (
    typeof step6.other_conditions === "string" &&
    step6.other_conditions.trim() !== ""
  ) {
    return [step6.other_conditions.trim()];
  }

  return fallback;
}

function resolveTenantRoleIds(
  step6: Partial<ContractStep6ApiData>,
  fallback: number[],
): number[] {
  if (Array.isArray(step6.tenant_role_ids) && step6.tenant_role_ids.length > 0) {
    return step6.tenant_role_ids.filter(
      (id): id is number => typeof id === "number" && Number.isFinite(id),
    );
  }

  if (typeof step6.tenant_role_id === "number" && step6.tenant_role_id > 0) {
    return [step6.tenant_role_id];
  }

  if (Array.isArray(step6.tenant_roles_details)) {
    const ids = step6.tenant_roles_details
      .map((role) => role.id)
      .filter((id): id is number => typeof id === "number" && Number.isFinite(id));

    if (ids.length > 0) {
      return ids;
    }
  }

  return fallback;
}

function resolveTenantRoleValues(
  step6: Partial<ContractStep6ApiData>,
  selectedIds: number[],
  fallback: Record<string, string>,
): Record<string, string> {
  const values: Record<string, string> = {};

  if (
    step6.tenant_role_values &&
    typeof step6.tenant_role_values === "object" &&
    !Array.isArray(step6.tenant_role_values)
  ) {
    for (const [key, value] of Object.entries(step6.tenant_role_values)) {
      if (value != null && String(value).trim() !== "") {
        values[key] = String(value);
      }
    }
  }

  if (Array.isArray(step6.tenant_roles_details)) {
    for (const detail of step6.tenant_roles_details as TenantRoleDetail[]) {
      if (
        detail?.has_user_input &&
        detail.value != null &&
        String(detail.value).trim() !== ""
      ) {
        values[String(detail.id)] = String(detail.value);
      } else if (detail?.has_user_input && !(String(detail.id) in values)) {
        values[String(detail.id)] = "";
      }
    }
  }

  for (const id of selectedIds) {
    const key = String(id);
    if (key in values) {
      continue;
    }
    if (key in fallback) {
      values[key] = fallback[key];
    }
  }

  return Object.keys(values).length > 0 ? values : fallback;
}

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
  const otherConditionsList = resolveOtherConditionsFromStep6(
    step6,
    base.otherConditionsList,
  );
  const conditionsEnabled =
    step6.conditions === true ||
    step6.conditions === 1 ||
    otherConditionsList.length > 0;

  const selectedTenantRoleIds = resolveTenantRoleIds(
    step6,
    base.selectedTenantRoleIds,
  );
  const tenantRoleValues = resolveTenantRoleValues(
    step6,
    selectedTenantRoleIds,
    base.tenantRoleValues,
  );
  const tenantRolesEnabled =
    step6.tenant_roles === true ||
    step6.tenant_roles === 1 ||
    selectedTenantRoleIds.length > 0;

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
    addTenantPermissions: tenantRolesEnabled,
    selectedTenantRoleIds: tenantRolesEnabled ? selectedTenantRoleIds : [],
    tenantRoleValues: tenantRolesEnabled ? tenantRoleValues : {},
    addOtherConditions: conditionsEnabled,
    otherConditionsList: conditionsEnabled
      ? otherConditionsList.length > 0
        ? otherConditionsList
        : [""]
      : [],
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
