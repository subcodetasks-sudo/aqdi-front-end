export const DEED_TYPES = [
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

export type DeedTypeId = (typeof DEED_TYPES)[number];

export const DEED_STEP_PHASE_COUNT = 2;
