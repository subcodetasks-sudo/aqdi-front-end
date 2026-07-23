import type { CalendarType } from "@/features/create-contract/types/owner-step";

import type { TenantRoleDetail } from "@/features/create-contract/types/tenant-role";

export type UncompletedContractStep1 = {
  id: number;
  contract_id: number;
  uuid: string;
  contract_type: string;
  contract_type_trans: string;
  real_id: number | null;
  real_units_id: number | null;
  instrument_type: string;
  instrument_type_trans: string;
  image_instrument: string | null;
  image_instrument_from_the_front: string | null;
  image_instrument_from_the_back: string | null;
  Image_inheritance_certificate: string | null;
  copy_power_of_attorney_from_heirs_to_agent: string | null;
  copy_of_the_endowment_registration_certificate: string | null;
  copy_of_the_trusteeship_deed: string | null;
  is_multiple_trusteeship_deed_copy: boolean | number | null;
  copy_of_guardians_power_of_attorney_for_agent: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  lat: number | string | null;
  lng: number | string | null;
  address_url: string | null;
  step: number;
};

export type UncompletedContractStep2 = {
  id: number;
  uuid: string;
  contract_type: string;
  instrument_type: string;
  image_instrument: string | null;
  image_address: string | null;
  address_url: string | null;
  latitude: string | null;
  longitude: string | null;
  step: number;
};

export type UncompletedContractStep3 = {
  id: number;
  uuid: string;
  name_real_estate: string | null;
  name_owner: string | null;
  property_owner_id_num: string | null;
  property_owner_dob: string | null;
  type_dob_property_owner: CalendarType | null;
  property_owner_mobile: string | null;
  property_owner_iban: string | null;
  add_legal_agent_of_owner: number | boolean | null;
  id_num_of_property_owner_agent: string | null;
  dob_of_property_owner_agent: string | null;
  type_dob_property_owner_agent: CalendarType | null;
  mobile_of_property_owner_agent: string | null;
  copy_of_the_authorization_or_agency: string | null;
  step: number;
};

export type UncompletedContractStep6 = {
  id?: number;
  contract_id?: number;
  uuid?: string;
  contract_term_in_years?: number | null;
  annual_rent_amount_for_the_unit?: number | null;
  payment_type_id?: number | null;
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
  step?: number;
};

export type UncompletedContractData = {
  step: number;
  contract_id: number;
  uuid: string;
  step1: UncompletedContractStep1 | null;
  step2: UncompletedContractStep2 | null;
  step3: UncompletedContractStep3 | null;
  step6?: UncompletedContractStep6 | null;
};

export type UncompletedContractApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: UncompletedContractData;
};
