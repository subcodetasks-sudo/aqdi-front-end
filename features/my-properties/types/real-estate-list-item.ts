export type RealEstateListItem = {
  id: number;
  uuid: string | null;
  instrument_type: string;
  contract_type: "housing" | "commercial";
  created_at: string;
  property_type_id: number | null;
  property_type_name: string | null;
  property_usages_id: number | null;
  property_usages_name: string | null;
  number_of_floors: number | null;
  number_of_units_in_realestate: number | null;
  image_instrument: string | null;
  image_address: string | null;
  address_url: string | null;
  age_of_the_property: string | null;
  number_of_units_per_floor: number | null;
  latitude: string | null;
  longitude: string | null;
  step: number;
};

export type RealEstateIndexApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: RealEstateListItem[];
};
