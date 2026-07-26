export const LEASE_RENEWAL_ADDRESS_MODES = ["same", "change"] as const;

export type LeaseRenewalAddressMode =
  (typeof LEASE_RENEWAL_ADDRESS_MODES)[number];
