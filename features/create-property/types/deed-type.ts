export const PROPERTY_DEED_TYPES = [
  "electronic_deed_from_the_ministry_of_justice",
  "electronic_tax_register",
  "old_handwritten",
  "property_ownership_owner_are_deceased_endowment",
  "property_ownership_owner_is_endowment",
  "sale_agreement",
  "economic_cities_authority_suspended",
  "strong_argument",
] as const;

export type PropertyDeedTypeId = (typeof PROPERTY_DEED_TYPES)[number];
