export const NATIONAL_ADDRESS_METHODS = ["map", "photo", "link"] as const;

export type NationalAddressMethodId = (typeof NATIONAL_ADDRESS_METHODS)[number];

export type NationalAddressMapLocation = {
  lat: number;
  lng: number;
};

export const DEFAULT_NATIONAL_ADDRESS_LOCATION: NationalAddressMapLocation = {
  lat: 24.7136,
  lng: 46.6753,
};
