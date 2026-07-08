import type { CalendarType } from "@/features/create-contract/types/owner-step";

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

export type UncompletedContractData = {
  step: number;
  contract_id: number;
  uuid: string;
  step1: UncompletedContractStep1 | null;
  step2: UncompletedContractStep2 | null;
  step3: UncompletedContractStep3 | null;
};

export type UncompletedContractApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: UncompletedContractData;
};
