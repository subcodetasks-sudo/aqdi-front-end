export type PropertyUnitTab = "residential" | "commercial";

export type PropertyUnitCategory = "residential" | "commercial";

export type PropertyUnitDetails = {
  unitType: string;
  unitUse: string;
  floorNumber: string;
  unitArea: string;
  roomsCount: string;
  hallsCount: string;
  kitchensCount: string;
  bathroomsCount: string;
  windowAcCount: string;
  splitAcCount: string;
};

export type PropertyUnitCardData = {
  id: string;
  unitNumber: string;
  category: PropertyUnitCategory;
  details: PropertyUnitDetails;
};

export const PROPERTY_UNIT_DETAIL_FIELDS = [
  "unitType",
  "unitUse",
  "floorNumber",
  "unitArea",
  "roomsCount",
  "hallsCount",
  "kitchensCount",
  "bathroomsCount",
  "windowAcCount",
  "splitAcCount",
] as const;

export type PropertyUnitDetailField = (typeof PROPERTY_UNIT_DETAIL_FIELDS)[number];
