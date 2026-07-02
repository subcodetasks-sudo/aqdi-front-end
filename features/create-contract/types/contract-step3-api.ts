export type ContractStep3ApiData = {
  id: number;
  contract_id: number;
  uuid: string;
  name_owner: string | null;
  property_owner_id_num: string | null;
  type_dob_property_owner: string | null;
  property_owner_mobile: string | null;
  property_owner_iban: string | null;
  add_legal_agent_of_owner: number | boolean | null;
  id_num_of_property_owner_agent: string | null;
  mobile_of_property_owner_agent: string | null;
  step: number;
};
