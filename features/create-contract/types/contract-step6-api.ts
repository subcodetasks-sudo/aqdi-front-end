import type { TenantRoleDetail } from "@/features/create-contract/types/tenant-role";
import type { ContractFinancialData } from "@/features/create-contract/types/contract-financial";

export type ContractStep6ApiData = {
  id: number;
  contract_id: number;
  uuid: string;
  contract_term_in_years: number | null;
  annual_rent_amount_for_the_unit: number | null;
  payment_type_id: number | null;
  duration_preset?: string | null;
  duration_years?: number | null;
  duration_months?: number | null;
  total_months?: number | null;
  doc_fee?: number | null;
  doc_fee_lines?: string[] | null;
  conditions?: boolean | number | null;
  other_conditions?: string | null;
  other_conditions_list?: string[] | null;
  tenant_roles?: boolean | number | null;
  tenant_role_id?: number | null;
  tenant_role_ids?: number[] | null;
  tenant_role_values?: Record<string, string> | null;
  tenant_roles_details?: TenantRoleDetail[] | null;
  step: number;
  /** Financial summary returned after step6 submit (AQDI API V2). */
  details?: ContractFinancialData["details"];
  price_details?: ContractFinancialData["price_details"];
  subtotal?: number | null;
  tax_percent?: number | null;
  tax_amount?: number | null;
  total_price?: number | null;
  coupon?: number | null;
  total_price_after_coupon?: number | null;
};
