export type PropertyUnitApiItem = {
  id: number;
  unit_area: string | null;
  unit_type_id: number | null;
  unit_usage_id: number | null;
  floor_number: string | null;
  unit_number: string | null;
  tootal_rooms: string | null;
  number_of_rooms: number | null;
  The_number_of_halls: string | null;
  The_number_of_kitchens: string | null;
  The_number_of_toilets: string | null;
  The_number_of_the_toilet: string | null;
  window_ac: number | null;
  split_ac: number | null;
  kitchen_tank: boolean | null;
  furnished: boolean | null;
  type_furnished: boolean | null;
  electricity_meter: boolean | null;
  water_meter: boolean | null;
  electricity_meter_number: string | null;
  water_meter_number: string | null;
  contract_type: "housing" | "commercial" | null;
};

export type PropertyWithUnitsApiData = {
  id: number;
  name_real_estate: string | null;
  contract_type: "housing" | "commercial" | null;
  instrument_type: string | null;
  image_instrument: string | null;
  image_address: string | null;
  address_url: string | null;
  latitude: string | null;
  longitude: string | null;
  name_owner: string | null;
  property_owner_id_num: string | null;
  type_dob_property_owner: "hijri" | "gregorian" | null;
  dob_hijri: string | null;
  property_owner_dob_hijri: string | null;
  property_owner_mobile: string | null;
  property_owner_iban: string | null;
  add_legal_agent_of_owner: number | null;
  id_num_of_property_owner_agent: string | null;
  type_dob_property_owner_agent: "hijri" | "gregorian" | null;
  dob_of_property_owner_agent: string | null;
  mobile_of_property_owner_agent: string | null;
  copy_of_the_authorization_or_agency: string | null;
  step: number | null;
  units: PropertyUnitApiItem[];
};

export type PropertyUnitsApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: PropertyWithUnitsApiData;
};
