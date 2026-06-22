export const PROPERTY_TYPES = [
  "building",
  "villa",
  "land",
  "compound",
] as const;

export const PROPERTY_USES = [
  "residential",
  "commercial",
  "residential-commercial",
  "industrial",
] as const;

export const PROPERTY_AGES = [
  "1-year",
  "2-years",
  "3-years",
  "4-years",
  "5-years",
  "6-10-years",
  "10-plus-years",
] as const;

export const FLOOR_COUNTS = [
  "1-floor",
  "2-floors",
  "3-floors",
  "4-floors",
  "5-plus-floors",
] as const;

export const UNITS_PER_FLOOR = [
  "1-unit",
  "2-units",
  "3-units",
  "4-units",
  "5-plus-units",
] as const;

export const TOTAL_UNITS = [
  "1-unit",
  "2-units",
  "3-units",
  "4-units",
  "5-units",
  "6-units",
  "7-plus-units",
] as const;

export type PropertyTypeId = (typeof PROPERTY_TYPES)[number];
export type PropertyUseId = (typeof PROPERTY_USES)[number];
export type PropertyAgeId = (typeof PROPERTY_AGES)[number];
export type FloorCountId = (typeof FLOOR_COUNTS)[number];
export type UnitsPerFloorId = (typeof UNITS_PER_FLOOR)[number];
export type TotalUnitsId = (typeof TOTAL_UNITS)[number];

export type PropertyDetailsState = {
  propertyType: PropertyTypeId | "";
  propertyUse: PropertyUseId | "";
  propertyAge: PropertyAgeId | "";
  floorCount: FloorCountId | "";
  unitsPerFloor: UnitsPerFloorId | "";
  totalUnits: TotalUnitsId | "";
};

export const EMPTY_PROPERTY_DETAILS: PropertyDetailsState = {
  propertyType: "",
  propertyUse: "",
  propertyAge: "",
  floorCount: "",
  unitsPerFloor: "",
  totalUnits: "",
};

export function isPropertyDetailsComplete(details: PropertyDetailsState) {
  return (
    details.propertyType !== "" &&
    details.propertyUse !== "" &&
    details.propertyAge !== "" &&
    details.floorCount !== "" &&
    details.unitsPerFloor !== "" &&
    details.totalUnits !== ""
  );
}
