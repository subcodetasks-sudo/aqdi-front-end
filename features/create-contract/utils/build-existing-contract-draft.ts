import { BASE_URL } from "@/lib/api/constants";
import {
  EMPTY_AGENT_DATA,
  EMPTY_BIRTH_DATE,
  EMPTY_OWNER_DATA,
  type AgentDataState,
  type BirthDateValue,
  type CalendarType,
  type HasAgentOption,
  type OwnerDataState,
} from "@/features/create-contract/types/owner-step";
import {
  EMPTY_RENTED_UNIT_DATA,
  type RentedUnitDataState,
} from "@/features/create-contract/types/rented-unit-step";
import type {
  PropertyUnitApiItem,
  PropertyWithUnitsApiData,
} from "@/features/property-units/types/property-units-api";

function getAssetOrigin() {
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return BASE_URL.replace(/\/$/, "");
  }
}

export function resolveContractAssetUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Assets are served from the host root (e.g. /storage, /uploads), not from the
  // API path in BASE_URL (which may be suffixed with /api), so use the origin.
  return `${getAssetOrigin()}/${path.replace(/^\//, "")}`;
}

export function parseContractBirthDate(
  value: string | null | undefined,
  calendarType: CalendarType,
): BirthDateValue {
  if (!value) {
    return { ...EMPTY_BIRTH_DATE, calendarType };
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

  return { ...EMPTY_BIRTH_DATE, calendarType };
}

export function formatContractPhoneForForm(phone: string | null) {
  if (!phone) {
    return "";
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("966")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+966${digits.slice(1)}`;
  }

  return digits.startsWith("+") ? phone : `+966${digits}`;
}

function toStringValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function buildContractOwnerData(
  property: PropertyWithUnitsApiData,
): OwnerDataState {
  const calendarType: CalendarType = property.type_dob_property_owner ?? "hijri";
  const hasAgent: HasAgentOption =
    property.add_legal_agent_of_owner === 1 ? "yes" : "no";

  return {
    ...EMPTY_OWNER_DATA,
    fullName: property.name_owner?.trim() ?? "",
    idNumber: property.property_owner_id_num?.replace(/\D/g, "") ?? "",
    birthDate: parseContractBirthDate(
      property.property_owner_dob_hijri ?? property.dob_hijri,
      calendarType,
    ),
    phone: formatContractPhoneForForm(property.property_owner_mobile),
    iban: property.property_owner_iban ?? "",
    hasAgent,
  };
}

export function buildContractAgentData(
  property: PropertyWithUnitsApiData,
): AgentDataState {
  const calendarType: CalendarType =
    property.type_dob_property_owner_agent ?? "gregorian";

  return {
    ...EMPTY_AGENT_DATA,
    idNumber: property.id_num_of_property_owner_agent?.replace(/\D/g, "") ?? "",
    birthDate: parseContractBirthDate(property.dob_of_property_owner_agent, calendarType),
    phone: formatContractPhoneForForm(property.mobile_of_property_owner_agent),
    powerOfAttorneyFiles: [],
  };
}

export function buildRentedUnitData(
  unit: PropertyUnitApiItem,
): RentedUnitDataState {
  return {
    ...EMPTY_RENTED_UNIT_DATA,
    unitTypeId: toStringValue(unit.unit_type_id),
    unitUsageId: toStringValue(unit.unit_usage_id),
    totalArea: toStringValue(unit.unit_area),
    floorNumber: toStringValue(unit.floor_number),
    unitNumber: toStringValue(unit.unit_number),
    roomsCount: toStringValue(unit.number_of_rooms ?? unit.tootal_rooms),
    hallsCount: toStringValue(unit.The_number_of_halls),
    kitchensCount: toStringValue(unit.The_number_of_kitchens),
    bathroomsCount: toStringValue(
      unit.The_number_of_toilets ?? unit.The_number_of_the_toilet,
    ),
    windowAcCount: toStringValue(unit.window_ac),
    splitAcCount: toStringValue(unit.split_ac),
    kitchenCabinetsInstalled: Boolean(unit.kitchen_tank),
    furnished: Boolean(unit.furnished),
    addElectricityMeter: Boolean(unit.electricity_meter),
    electricityMeterNumber: toStringValue(unit.electricity_meter_number),
    addWaterMeter: Boolean(unit.water_meter),
    waterMeterNumber: toStringValue(unit.water_meter_number),
  };
}
