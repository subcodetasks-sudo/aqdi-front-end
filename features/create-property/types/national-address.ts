import {
  isManualNationalAddressComplete,
  type ManualNationalAddressData,
} from "@/features/shared/types/manual-national-address";

export const PROPERTY_NATIONAL_ADDRESS_METHODS = [
  "map",
  "photo",
  "link",
  "manual",
] as const;

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

export function canContinueNationalAddress(
  method: PropertyNationalAddressMethodId,
  photoFiles: File[],
  linkUrl: string,
  options?: {
    hasExistingPhoto?: boolean;
    manualAddress?: ManualNationalAddressData;
  },
) {
  if (method === "map") {
    return true;
  }

  if (method === "photo") {
    return photoFiles.length > 0 || Boolean(options?.hasExistingPhoto);
  }

  if (method === "link") {
    return linkUrl.trim().length > 0;
  }

  if (method === "manual") {
    return options?.manualAddress
      ? isManualNationalAddressComplete(options.manualAddress)
      : false;
  }

  return false;
}
