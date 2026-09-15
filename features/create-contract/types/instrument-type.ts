export const CONTRACT_INSTRUMENT_TYPES = [
  "electronic",
  "old_handwritten",
  "strong_argument",
  "electronic_tax_register",
  "property_ownership_owner_are_deceased_endowment",
  "property_ownership_owner_is_endowment",
  "sale_agreement",
  "electronic_deed_from_the_ministry_of_justice",
  "economic_cities_authority_suspended",
  "sublease_agreement",
  "lease_renewal",
  "property_ownership_owner_are_suspended",
  "property_ownership_owner_are_deceased",
] as const;

export type ContractInstrumentType = (typeof CONTRACT_INSTRUMENT_TYPES)[number];
