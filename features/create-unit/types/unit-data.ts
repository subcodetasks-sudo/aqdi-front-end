export const FURNISHING_TYPE_OPTIONS = ["new", "used"] as const;

export type FurnishingTypeOption = (typeof FURNISHING_TYPE_OPTIONS)[number];

export const METER_REGISTRATION_PARTIES = ["owner", "tenant"] as const;

export type MeterRegistrationParty =
  (typeof METER_REGISTRATION_PARTIES)[number];

export type UnitDataState = {
  unitTypeId: string;
  unitUsageId: string;
  totalArea: string;
  floorNumber: string;
  unitNumber: string;
  roomsCount: string;
  hallsCount: string;
  majlisCount: string;
  kitchensCount: string;
  bathroomsCount: string;
  windowAcCount: string;
  splitAcCount: string;
  kitchenCabinetsInstalled: boolean;
  furnished: boolean;
  furnishingType: FurnishingTypeOption | "";
  addElectricityMeter: boolean;
  electricityMeterNumber: string;
  electricityMeterRegistration: MeterRegistrationParty | "";
  addWaterMeter: boolean;
  waterMeterNumber: string;
  waterMeterRegistration: MeterRegistrationParty | "";
};

export const EMPTY_UNIT_DATA: UnitDataState = {
  unitTypeId: "",
  unitUsageId: "",
  totalArea: "",
  floorNumber: "",
  unitNumber: "",
  roomsCount: "",
  hallsCount: "",
  majlisCount: "",
  kitchensCount: "",
  bathroomsCount: "",
  windowAcCount: "",
  splitAcCount: "",
  kitchenCabinetsInstalled: false,
  furnished: false,
  furnishingType: "",
  addElectricityMeter: false,
  electricityMeterNumber: "",
  electricityMeterRegistration: "",
  addWaterMeter: false,
  waterMeterNumber: "",
  waterMeterRegistration: "",
};

function isSelectFilled(value: string) {
  return value !== "";
}

function isPositiveNumber(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  if (normalized === "") {
    return false;
  }

  const number = Number(normalized);
  return Number.isFinite(number) && number > 0;
}

export function isUnitDataComplete(
  unitData: UnitDataState,
  options?: { requireMeterRegistration?: boolean },
) {
  const baseComplete =
    isSelectFilled(unitData.unitTypeId) &&
    isSelectFilled(unitData.unitUsageId) &&
    isPositiveNumber(unitData.totalArea) &&
    isSelectFilled(unitData.floorNumber) &&
    unitData.unitNumber.trim() !== "";

  if (!baseComplete) {
    return false;
  }

  if (!options?.requireMeterRegistration) {
    return true;
  }

  if (
    unitData.addElectricityMeter &&
    unitData.electricityMeterRegistration === ""
  ) {
    return false;
  }

  if (unitData.addWaterMeter && unitData.waterMeterRegistration === "") {
    return false;
  }

  return true;
}

export function areAllUnitsComplete(
  units: UnitDataState[],
  options?: { requireMeterRegistration?: boolean },
) {
  return units.length > 0 && units.every((unit) => isUnitDataComplete(unit, options));
}

export function buildCountOptions(max = 20) {
  return Array.from({ length: max + 1 }, (_, index) => {
    const value = String(index);
    return { value, label: value };
  });
}
