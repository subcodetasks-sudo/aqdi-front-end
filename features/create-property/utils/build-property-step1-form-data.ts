import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import type { PropertyDetailsState } from "@/features/create-property/types/property-details";
import type { PropertyNationalAddressMethodId } from "@/features/create-property/types/national-address";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import {
  appendManualNationalAddressFields,
  type ManualNationalAddressData,
} from "@/features/shared/types/manual-national-address";
import {
  appendManualDeedEntryFields,
  type ManualDeedEntryData,
} from "@/features/shared/types/manual-deed-entry";

export type PropertyStep1FormPayload = {
  propertyId?: number;
  contractType: PropertyContractType;
  /** API `instrument_type` value (may differ from the UI deed option id). */
  instrumentType: PropertyDeedTypeId | string;
  propertyDetails: PropertyDetailsState;
  includeStrongArgumentFields?: boolean;
  imageInstrument?: File;
  imageInstrumentFront?: File;
  imageInstrumentBack?: File;
  imageInheritanceCertificate?: File;
  copyPowerOfAttorneyFromHeirsToAgent?: File;
  copyOfTheEndowmentRegistrationCertificate?: File;
  copyOfTheTrusteeshipDeed?: File;
  isMultipleTrusteeshipDeedCopy?: boolean;
  copyOfGuardiansPowerOfAttorneyForAgent?: File;
  manualDeedEntry?: ManualDeedEntryData;
  addressMethod: PropertyNationalAddressMethodId;
  imageAddress?: File;
  addressUrl?: string;
  manualAddress?: ManualNationalAddressData;
  latitude: number;
  longitude: number;
};

export function appendPropertyStep1Fields(
  formData: FormData,
  payload: PropertyStep1FormPayload,
) {
  if (payload.propertyId) {
    formData.append("id", String(payload.propertyId));
  }

  formData.append("contract_type", payload.contractType);
  formData.append(
    "contract_ownership",
    payload.propertyDetails.contractOwnership || "owner",
  );
  formData.append("instrument_type", payload.instrumentType);

  if (payload.propertyDetails.propertyTypeId !== "") {
    formData.append(
      "property_type_id",
      String(payload.propertyDetails.propertyTypeId),
    );
  }

  if (payload.propertyDetails.propertyUsagesId !== "") {
    formData.append(
      "property_usages_id",
      String(payload.propertyDetails.propertyUsagesId),
    );
  }

  if (payload.propertyDetails.numberOfFloors.trim()) {
    formData.append(
      "number_of_floors",
      payload.propertyDetails.numberOfFloors.replace(/\D/g, ""),
    );
  }

  if (payload.propertyDetails.numberOfUnitsInRealEstate.trim()) {
    formData.append(
      "number_of_units_in_realestate",
      payload.propertyDetails.numberOfUnitsInRealEstate.trim(),
    );
  }

  if (payload.propertyDetails.numberOfUnitsPerFloor.trim()) {
    formData.append(
      "number_of_units_per_floor",
      payload.propertyDetails.numberOfUnitsPerFloor.replace(/\D/g, ""),
    );
  }

  if (payload.propertyDetails.ageOfTheProperty.trim()) {
    formData.append(
      "age_of_the_property",
      payload.propertyDetails.ageOfTheProperty.replace(/\D/g, ""),
    );
  }

  if (payload.propertyDetails.electricityMeterOwnership) {
    formData.append(
      "electricity_meter_ownership",
      payload.propertyDetails.electricityMeterOwnership,
    );
  }

  if (payload.propertyDetails.waterMeterOwnership) {
    formData.append(
      "water_meter_ownership",
      payload.propertyDetails.waterMeterOwnership,
    );
  }

  if (payload.includeStrongArgumentFields) {
    formData.append(
      "real_estate_registry_number",
      payload.propertyDetails.realEstateRegistryNumber.trim(),
    );
    formData.append(
      "type_date_first_registration",
      payload.propertyDetails.typeDateFirstRegistration,
    );
    formData.append(
      "date_first_registration_day",
      payload.propertyDetails.dateFirstRegistrationDay
        .replace(/\D/g, "")
        .padStart(2, "0"),
    );
    formData.append(
      "date_first_registration_month",
      payload.propertyDetails.dateFirstRegistrationMonth
        .replace(/\D/g, "")
        .padStart(2, "0"),
    );
    formData.append(
      "date_first_registration_year",
      payload.propertyDetails.dateFirstRegistrationYear.replace(/\D/g, ""),
    );
  }

  if (payload.imageInstrument) {
    formData.append("image_instrument", payload.imageInstrument);
  }

  if (payload.imageInstrumentFront) {
    formData.append(
      "image_instrument_from_the_front",
      payload.imageInstrumentFront,
    );
  }

  if (payload.imageInstrumentBack) {
    formData.append(
      "image_instrument_from_the_back",
      payload.imageInstrumentBack,
    );
  }

  if (payload.imageInheritanceCertificate) {
    formData.append(
      "Image_inheritance_certificate",
      payload.imageInheritanceCertificate,
    );
  }

  if (payload.copyPowerOfAttorneyFromHeirsToAgent) {
    formData.append(
      "copy_power_of_attorney_from_heirs_to_agent",
      payload.copyPowerOfAttorneyFromHeirsToAgent,
    );
  }

  if (payload.copyOfTheEndowmentRegistrationCertificate) {
    formData.append(
      "copy_of_the_endowment_registration_certificate",
      payload.copyOfTheEndowmentRegistrationCertificate,
    );
  }

  if (payload.copyOfTheTrusteeshipDeed) {
    formData.append(
      "copy_of_the_trusteeship_deed",
      payload.copyOfTheTrusteeshipDeed,
    );
  }

  if (payload.isMultipleTrusteeshipDeedCopy !== undefined) {
    formData.append(
      "is_multiple_trusteeship_deed_copy",
      payload.isMultipleTrusteeshipDeedCopy ? "1" : "0",
    );
  }

  if (payload.copyOfGuardiansPowerOfAttorneyForAgent) {
    formData.append(
      "copy_of_guardians_power_of_attorney_for_agent",
      payload.copyOfGuardiansPowerOfAttorneyForAgent,
    );
  }

  if (payload.manualDeedEntry) {
    appendManualDeedEntryFields(formData, payload.manualDeedEntry);
  }

  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));
  formData.append("lat", String(payload.latitude));
  formData.append("lng", String(payload.longitude));

  if (payload.addressMethod === "photo" && payload.imageAddress) {
    formData.append("image_address", payload.imageAddress);
  }

  if (payload.addressMethod === "link" && payload.addressUrl) {
    formData.append("address_url", payload.addressUrl);
  }

  if (payload.addressMethod === "manual" && payload.manualAddress) {
    appendManualNationalAddressFields(formData, payload.manualAddress);
  }
}
