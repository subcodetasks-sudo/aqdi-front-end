import {
  EMPTY_PROPERTY_DETAILS,
  type PropertyDetailsState,
} from "@/features/create-property/types/property-details";
import {
  PROPERTY_DEED_TYPES,
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsWaqfOwner,
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
import { resolveAssetUrl } from "@/features/shared/utils/resolve-asset-url";
import { formatSaudiMobileForForm } from "@/lib/validation/format-saudi-mobile-for-form";

export type PropertyEditDraftData = {
  propertyId: number;
  isEditMode: true;
  selectedDeedType: PropertyDeedTypeId | "";
  propertyDetails: PropertyDetailsState;
  existingDeedImageUrl: string | null;
  existingDeedFrontImageUrl: string | null;
  existingDeedBackImageUrl: string | null;
  existingInheritanceImageUrl: string | null;
  existingHeirsPoaImageUrl: string | null;
  existingEndowmentCertImageUrl: string | null;
  existingTrusteeshipImageUrl: string | null;
  existingGuardiansPoaImageUrl: string | null;
  existingAddressImageUrl: string | null;
  existingPowerOfAttorneyImageUrl: string | null;
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

function digitsOnly(value: string | number | null | undefined) {
  return String(value ?? "").replace(/\D/g, "");
}

function parseBirthDate(
  value: string | null | undefined,
  calendarType: PropertyCalendarType,
): PropertyBirthDateValue {
  if (!value) {
    return { ...EMPTY_PROPERTY_BIRTH_DATE, calendarType };
  }

  const parts = value
    .trim()
    .split(/[-/]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length !== 3) {
    return { ...EMPTY_PROPERTY_BIRTH_DATE, calendarType };
  }

  // ISO-style YYYY-MM-DD from some API responses.
  if (parts[0].length === 4) {
    return {
      calendarType,
      year: parts[0],
      month: parts[1].padStart(2, "0"),
      day: parts[2].padStart(2, "0"),
    };
  }

  // DD-MM-YYYY (common for this API).
  return {
    calendarType,
    day: parts[0].padStart(2, "0"),
    month: parts[1].padStart(2, "0"),
    year: parts[2],
  };
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

  return "photo";
}

function formatPhoneForForm(phone: string | null) {
  return formatSaudiMobileForForm(phone);
}

function resolveFirstAssetUrl(
  ...values: Array<string | null | undefined>
): string | null {
  for (const value of values) {
    const resolved = resolveAssetUrl(value);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}

function resolvePropertyDetails(
  property: PropertyWithUnitsApiData,
): PropertyDetailsState {
  const extended = property as PropertyWithUnitsApiData & {
    property_type_id?: number | string | null;
    property_usages_id?: number | string | null;
    number_of_floors?: number | string | null;
    number_of_units_in_realestate?: number | string | null;
    number_of_units_per_floor?: number | string | null;
    age_of_the_property?: number | string | null;
    electricity_meter_ownership?: "owner" | "tenant" | null;
    water_meter_ownership?: "owner" | "tenant" | null;
    contract_ownership?: "owner" | "tenant" | null;
    real_estate_registry_number?: string | null;
  };

  const propertyTypeId = Number(extended.property_type_id);
  const propertyUsagesId = Number(extended.property_usages_id);

  return {
    ...EMPTY_PROPERTY_DETAILS,
    propertyTypeId:
      Number.isFinite(propertyTypeId) && propertyTypeId > 0
        ? propertyTypeId
        : "",
    propertyUsagesId:
      Number.isFinite(propertyUsagesId) && propertyUsagesId > 0
        ? propertyUsagesId
        : "",
    numberOfFloors: String(extended.number_of_floors ?? "").replace(/\D/g, ""),
    numberOfUnitsInRealEstate: String(
      extended.number_of_units_in_realestate ?? "",
    ).trim(),
    numberOfUnitsPerFloor: String(
      extended.number_of_units_per_floor ?? "",
    ).replace(/\D/g, ""),
    ageOfTheProperty: String(extended.age_of_the_property ?? "").replace(
      /\D/g,
      "",
    ),
    electricityMeterOwnership:
      extended.electricity_meter_ownership === "owner" ||
      extended.electricity_meter_ownership === "tenant"
        ? extended.electricity_meter_ownership
        : "",
    waterMeterOwnership:
      extended.water_meter_ownership === "owner" ||
      extended.water_meter_ownership === "tenant"
        ? extended.water_meter_ownership
        : "",
    contractOwnership:
      extended.contract_ownership === "tenant" ? "tenant" : "owner",
    realEstateRegistryNumber:
      extended.real_estate_registry_number?.trim() ?? "",
  };
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
  // Some responses use the legacy lowercase key for the inheritance certificate.
  const inheritanceCertificate =
    property.Image_inheritance_certificate ??
    (
      property as PropertyWithUnitsApiData & {
        image_inheritance_certificate?: string | null;
      }
    ).image_inheritance_certificate;

  const selectedDeedType = mapInstrumentType(property.instrument_type);
  const isDeceasedOwner = propertyDeedTypeIsDeceasedOwner(selectedDeedType);
  const isWaqfOwner = propertyDeedTypeIsWaqfOwner(selectedDeedType);
  const guardiansPoaUrl =
    isDeceasedOwner || isWaqfOwner
      ? resolveFirstAssetUrl(
          property.copy_of_guardians_power_of_attorney_for_agent,
        )
      : null;

  return {
    propertyId: property.id,
    isEditMode: true,
    selectedDeedType,
    propertyDetails: resolvePropertyDetails(property),
    existingDeedImageUrl: resolveFirstAssetUrl(property.image_instrument),
    existingDeedFrontImageUrl: resolveFirstAssetUrl(
      property.image_instrument_from_the_front,
    ),
    existingDeedBackImageUrl: resolveFirstAssetUrl(
      property.image_instrument_from_the_back,
    ),
    existingInheritanceImageUrl: isDeceasedOwner
      ? resolveFirstAssetUrl(inheritanceCertificate)
      : null,
    existingHeirsPoaImageUrl: isDeceasedOwner
      ? resolveFirstAssetUrl(
          property.copy_power_of_attorney_from_heirs_to_agent,
        )
      : null,
    existingEndowmentCertImageUrl: isWaqfOwner
      ? resolveFirstAssetUrl(
          property.copy_of_the_endowment_registration_certificate,
        )
      : null,
    existingTrusteeshipImageUrl: isWaqfOwner
      ? resolveFirstAssetUrl(property.copy_of_the_trusteeship_deed)
      : null,
    existingGuardiansPoaImageUrl: guardiansPoaUrl,
    existingAddressImageUrl: resolveFirstAssetUrl(property.image_address),
    existingPowerOfAttorneyImageUrl: resolveFirstAssetUrl(
      property.copy_of_the_authorization_or_agency,
    ),
    isMultipleTrusteeshipDeedCopy: isWaqfOwner
      ? Boolean(property.is_multiple_trusteeship_deed_copy)
      : false,
    hasExistingPowerOfAttorney: Boolean(property.copy_of_the_authorization_or_agency),
    addressMethod: resolveAddressMethod(property),
    addressLinkUrl: property.address_url?.trim() ?? "",
    addressManual: resolveManualAddress(property),
    mapLocation: {
      lat: Number(property.latitude) || 24.7136,
      lng: Number(property.longitude) || 46.6753,
    },
    ownerData: {
      idNumber: digitsOnly(property.property_owner_id_num),
      birthDate: ownerBirthDate,
      phone: formatPhoneForForm(property.property_owner_mobile),
      iban: property.property_owner_iban ?? "",
      hasAgent: hasAgent as "yes" | "no",
    },
    agentData: {
      idNumber: digitsOnly(property.id_num_of_property_owner_agent),
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
