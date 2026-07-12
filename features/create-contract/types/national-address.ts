import {
  isManualNationalAddressComplete,
  type ManualNationalAddressData,
} from "@/features/shared/types/manual-national-address";

export const NATIONAL_ADDRESS_METHODS = [
  "map",
  "photo",
  "link",
  "manual",
] as const;

export type NationalAddressMethodId = (typeof NATIONAL_ADDRESS_METHODS)[number];

export type NationalAddressMapLocation = {
  lat: number;
  lng: number;
};

export const DEFAULT_NATIONAL_ADDRESS_LOCATION: NationalAddressMapLocation = {
  lat: 24.7136,
  lng: 46.6753,
};

export function canContinueNationalAddress(
  method: NationalAddressMethodId,
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
