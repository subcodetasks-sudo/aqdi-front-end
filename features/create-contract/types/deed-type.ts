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

// Deed types that require separate front and back instrument images
// (paper ownership deed / adverse possession).
export const FRONT_BACK_DEED_TYPES: readonly DeedTypeId[] = [
  "paper",
  "adverse-possession",
];

export function deedTypeNeedsFrontBack(deedType: DeedTypeId | ""): boolean {
  return deedType !== "" && FRONT_BACK_DEED_TYPES.includes(deedType);
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
