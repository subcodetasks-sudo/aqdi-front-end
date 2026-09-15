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

// Deed types that require separate front and back instrument images.
// Currently none — paper deeds use a single instrument image.
export const FRONT_BACK_DEED_TYPES: readonly DeedTypeId[] = [];

export function deedTypeNeedsFrontBack(deedType: DeedTypeId | ""): boolean {
  return deedType !== "" && FRONT_BACK_DEED_TYPES.includes(deedType);
}

export function deedTypeIsPaper(deedType: DeedTypeId | ""): boolean {
  return deedType === "paper";
}

export function deedTypeIsAdversePossession(deedType: DeedTypeId | ""): boolean {
  return deedType === "adverse-possession";
}

// Deceased-owner deed requires three images: the ownership deed, the
// inheritance certificate, and the heirs' power of attorney to the agent.
export function deedTypeIsDeceasedOwner(deedType: DeedTypeId | ""): boolean {
  return deedType === "deceased-owner";
}

// Waqf-owner deed requires the ownership deed, endowment registration
// certificate, trusteeship deed, and optionally guardians' POA.
export function deedTypeIsWaqfOwner(deedType: DeedTypeId | ""): boolean {
  return deedType === "waqf-owner";
}

export function deedTypeIsLeaseRenewal(deedType: DeedTypeId | ""): boolean {
  return deedType === "lease-renewal";
}

export function deedTypeIsSublease(deedType: DeedTypeId | ""): boolean {
  return deedType === "sublease-contract";
}

export function deedTypeIsSalePaper(deedType: DeedTypeId | ""): boolean {
  return deedType === "sale-paper";
}

export function deedTypeIsEconomicCitiesAuthority(
  deedType: DeedTypeId | "",
): boolean {
  return deedType === "economic-cities-authority";
}
