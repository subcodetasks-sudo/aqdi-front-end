export const PROPERTY_NATIONAL_ADDRESS_METHODS = ["map", "photo", "link"] as const;

export type PropertyNationalAddressMethodId =
  (typeof PROPERTY_NATIONAL_ADDRESS_METHODS)[number];

export type PropertyNationalAddressMapLocation = {
  lat: number;
  lng: number;
};

export const DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION: PropertyNationalAddressMapLocation =
  {
    lat: 24.7136,
    lng: 46.6753,
  };

function canContinueNationalAddress(
  method: PropertyNationalAddressMethodId,
  photoFiles: File[],
  linkUrl: string,
) {
  if (method === "map") {
    return true;
  }

  if (method === "photo") {
    return photoFiles.length > 0;
  }

  return linkUrl.trim().length > 0;
}

export { canContinueNationalAddress };
