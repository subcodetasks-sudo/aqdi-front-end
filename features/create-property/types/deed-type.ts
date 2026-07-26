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

export const FRONT_BACK_PROPERTY_DEED_TYPES: readonly PropertyDeedTypeId[] = [];

export function propertyDeedTypeNeedsFrontBack(
  deedType: PropertyDeedTypeId | "",
): boolean {
  return deedType !== "" && FRONT_BACK_PROPERTY_DEED_TYPES.includes(deedType);
}

export function propertyDeedTypeIsPaper(
  deedType: PropertyDeedTypeId | "",
): boolean {
  return deedType === "old_handwritten";
}

export function propertyDeedTypeIsAdversePossession(
  deedType: PropertyDeedTypeId | "",
): boolean {
  return deedType === "strong_argument";
}

export function propertyDeedTypeIsDeceasedOwner(
  deedType: PropertyDeedTypeId | "",
): boolean {
  return deedType === "property_ownership_owner_are_deceased_endowment";
}

export function propertyDeedTypeIsWaqfOwner(deedType: PropertyDeedTypeId | ""): boolean {
  return deedType === "property_ownership_owner_is_endowment";
}

export function propertyDeedTypeIsSalePaper(
  deedType: PropertyDeedTypeId | "",
): boolean {
  return deedType === "sale_agreement";
}

export function propertyDeedTypeIsEconomicCitiesAuthority(
  deedType: PropertyDeedTypeId | "",
): boolean {
  return deedType === "economic_cities_authority_suspended";
}
