export const PROPERTY_DEED_TYPES = [
  "electronic-justice-ministry",
  "electronic-real-estate-registry",
  "paper",
  "deceased-owner",
  "waqf-owner",
  "sale-paper",
  "economic-cities-authority",
  "adverse-possession",
  "sublease-contract",
  "lease-renewal",
] as const;

export type PropertyDeedTypeId = (typeof PROPERTY_DEED_TYPES)[number];
