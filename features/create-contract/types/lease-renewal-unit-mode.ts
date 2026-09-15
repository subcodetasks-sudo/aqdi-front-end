export const LEASE_RENEWAL_UNIT_MODES = ["same", "change"] as const;

export type LeaseRenewalUnitMode = (typeof LEASE_RENEWAL_UNIT_MODES)[number];
