import type { FinanceDataState } from "@/features/create-contract/types/finance-step";
import { mapPaymentMethodToTypeId } from "@/features/create-contract/utils/map-payment-method-to-type-id";
import {
  formatPropertyOwnerDatePart,
  formatPropertyOwnerYear,
} from "@/features/create-property/utils/property-owner-api";

export type ContractStep6Payload = {
  contractId: number;
  financeData: FinanceDataState;
};

function parseRentAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function buildContractStep6Body({
  contractId,
  financeData,
}: ContractStep6Payload) {
  const { contractStartDate } = financeData;

  if (financeData.contractPeriodId === "") {
    throw new Error("Contract period is required");
  }

  const body: Record<string, string | number | boolean | number[]> = {
    id: contractId,
    type_contract_starting_date: contractStartDate.calendarType,
    contract_starting_date_day: formatPropertyOwnerDatePart(contractStartDate.day),
    contract_starting_date_month: formatPropertyOwnerDatePart(
      contractStartDate.month,
    ),
    contract_starting_date_year: formatPropertyOwnerYear(contractStartDate.year),
    contract_term_in_years: financeData.contractPeriodId,
    annual_rent_amount_for_the_unit: parseRentAmount(financeData.totalRentAmount),
    payment_type_id: mapPaymentMethodToTypeId(
      financeData.paymentMethod as Exclude<FinanceDataState["paymentMethod"], "">,
    ),
    conditions: financeData.addOtherConditions,
    tenant_roles: financeData.addTenantPermissions,
    additional_terms: financeData.addOtherConditions,
  };

  if (financeData.addTenantPermissions && financeData.selectedTenantRoleIds.length > 0) {
    if (financeData.selectedTenantRoleIds.length === 1) {
      body.tenant_role_id = financeData.selectedTenantRoleIds[0];
    } else {
      body.tenant_role_ids = financeData.selectedTenantRoleIds;
    }
  }

  return body;
}
