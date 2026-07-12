import {
  PROPERTY_DEED_TYPES,
  type PropertyDeedTypeId,
} from "@/features/create-property/types/deed-type";
import {
  EMPTY_PROPERTY_AGENT_DATA,
  EMPTY_PROPERTY_BIRTH_DATE,
  EMPTY_PROPERTY_OWNER_DATA,
  type PropertyBirthDateValue,
  type PropertyCalendarType,
} from "@/features/create-property/types/owner-step";
import { EMPTY_PROPERTY_REVIEW_DATA } from "@/features/create-property/types/review-step";
import type { PropertyNationalAddressMethodId } from "@/features/create-property/types/national-address";
import {
  EMPTY_MANUAL_NATIONAL_ADDRESS,
  type ManualNationalAddressData,
} from "@/features/shared/types/manual-national-address";
import type { PropertyWithUnitsApiData } from "@/features/property-units/types/property-units-api";
import { formatSaudiMobileForForm } from "@/lib/validation/format-saudi-mobile-for-form";

export type PropertyEditDraftData = {
  propertyId: number;
  isEditMode: true;
  selectedDeedType: PropertyDeedTypeId | "";
  existingDeedImageUrl: string | null;
  existingDeedFrontImageUrl: string | null;
  existingDeedBackImageUrl: string | null;
  existingInheritanceImageUrl: string | null;
  existingHeirsPoaImageUrl: string | null;
  existingEndowmentCertImageUrl: string | null;
  existingTrusteeshipImageUrl: string | null;
  existingGuardiansPoaImageUrl: string | null;
  existingAddressImageUrl: string | null;
  isMultipleTrusteeshipDeedCopy: boolean;
  hasExistingPowerOfAttorney: boolean;
  addressMethod: PropertyNationalAddressMethodId;
  addressLinkUrl: string;
  addressManual: ManualNationalAddressData;
  mapLocation: { lat: number; lng: number };
  ownerData: typeof EMPTY_PROPERTY_OWNER_DATA;
  agentData: typeof EMPTY_PROPERTY_AGENT_DATA;
  reviewData: typeof EMPTY_PROPERTY_REVIEW_DATA;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

function resolveAssetUrl(path: string | null) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function mapInstrumentType(value: string | null): PropertyDeedTypeId | "" {
  if (!value) {
    return "";
  }

  if (PROPERTY_DEED_TYPES.includes(value as PropertyDeedTypeId)) {
    return value as PropertyDeedTypeId;
  }

  if (value === "electronic") {
    return "electronic_deed_from_the_ministry_of_justice";
  }

  return "";
}

function parseBirthDate(
  value: string | null | undefined,
  calendarType: PropertyCalendarType,
): PropertyBirthDateValue {
  if (!value) {
    return { ...EMPTY_PROPERTY_BIRTH_DATE, calendarType };
  }

  const parts = value.split("-");

  if (parts.length === 3) {
    return {
      calendarType,
      day: parts[0].padStart(2, "0"),
      month: parts[1].padStart(2, "0"),
      year: parts[2],
    };
  }

  return { ...EMPTY_PROPERTY_BIRTH_DATE, calendarType };
}

function resolveManualAddress(
  property: PropertyWithUnitsApiData,
): ManualNationalAddressData {
  const placeId = Number(property.property_place_id);
  const cityId = Number(property.property_city_id);

  return {
    propertyPlaceId: Number.isFinite(placeId) && placeId > 0 ? placeId : "",
    propertyCityId: Number.isFinite(cityId) && cityId > 0 ? cityId : "",
    neighborhood: property.neighborhood?.trim() ?? "",
    street: property.street?.trim() ?? "",
    buildingNumber: property.building_number?.trim() ?? "",
    postalCode: property.postal_code?.trim() ?? "",
    extraFigure: property.extra_figure?.trim() ?? "",
  };
}

function resolveAddressMethod(
  property: PropertyWithUnitsApiData,
): PropertyNationalAddressMethodId {
  const manualAddress = resolveManualAddress(property);
  const hasManualFields =
    manualAddress.propertyPlaceId !== "" ||
    manualAddress.propertyCityId !== "" ||
    manualAddress.neighborhood.length > 0 ||
    manualAddress.street.length > 0 ||
    manualAddress.buildingNumber.length > 0 ||
    manualAddress.postalCode.length > 0 ||
    manualAddress.extraFigure.length > 0;

  if (hasManualFields) {
    return "manual";
  }

  const addressUrl = property.address_url?.trim();

  if (addressUrl) {
    return "link";
  }

  if (property.image_address) {
    return "photo";
  }

  return "map";
}

function formatPhoneForForm(phone: string | null) {
  return formatSaudiMobileForForm(phone);
}

export function mapPropertyApiToEditDraft(
  property: PropertyWithUnitsApiData,
): PropertyEditDraftData {
  const ownerCalendarType = property.type_dob_property_owner ?? "hijri";
  const ownerBirthDate = parseBirthDate(
    property.property_owner_dob_hijri ?? property.dob_hijri,
    ownerCalendarType,
  );
  const agentCalendarType = property.type_dob_property_owner_agent ?? "gregorian";
  const hasAgent = property.add_legal_agent_of_owner === 1 ? "yes" : "no";

  return {
    propertyId: property.id,
    isEditMode: true,
    selectedDeedType: mapInstrumentType(property.instrument_type),
    existingDeedImageUrl: resolveAssetUrl(property.image_instrument),
    existingDeedFrontImageUrl: resolveAssetUrl(
      property.image_instrument_from_the_front,
    ),
    existingDeedBackImageUrl: resolveAssetUrl(property.image_instrument_from_the_back),
    existingInheritanceImageUrl: resolveAssetUrl(
      property.Image_inheritance_certificate,
    ),
    existingHeirsPoaImageUrl: resolveAssetUrl(
      property.copy_power_of_attorney_from_heirs_to_agent,
    ),
    existingEndowmentCertImageUrl: resolveAssetUrl(
      property.copy_of_the_endowment_registration_certificate,
    ),
    existingTrusteeshipImageUrl: resolveAssetUrl(property.copy_of_the_trusteeship_deed),
    existingGuardiansPoaImageUrl: resolveAssetUrl(
      property.copy_of_guardians_power_of_attorney_for_agent,
    ),
    existingAddressImageUrl: resolveAssetUrl(property.image_address),
    isMultipleTrusteeshipDeedCopy: Boolean(
      property.is_multiple_trusteeship_deed_copy,
    ),
    hasExistingPowerOfAttorney: Boolean(property.copy_of_the_authorization_or_agency),
    addressMethod: resolveAddressMethod(property),
    addressLinkUrl: property.address_url?.trim() ?? "",
    addressManual: resolveManualAddress(property),
    mapLocation: {
      lat: Number(property.latitude) || 24.7136,
      lng: Number(property.longitude) || 46.6753,
    },
    ownerData: {
      fullName: property.name_owner?.trim() ?? "",
      idNumber: property.property_owner_id_num?.replace(/\D/g, "") ?? "",
      birthDate: ownerBirthDate,
      phone: formatPhoneForForm(property.property_owner_mobile),
      iban: property.property_owner_iban ?? "",
      hasAgent: hasAgent as "yes" | "no",
    },
    agentData: {
      idNumber: property.id_num_of_property_owner_agent?.replace(/\D/g, "") ?? "",
      birthDate: parseBirthDate(
        property.dob_of_property_owner_agent,
        agentCalendarType,
      ),
      phone: formatPhoneForForm(property.mobile_of_property_owner_agent),
      powerOfAttorneyFiles: [],
    },
    reviewData: {
      propertyName: property.name_real_estate?.trim() ?? "",
    },
  };
}
