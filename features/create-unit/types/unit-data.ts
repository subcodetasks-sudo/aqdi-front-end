export const FURNISHING_TYPE_OPTIONS = ["new", "used"] as const;

export type FurnishingTypeOption = (typeof FURNISHING_TYPE_OPTIONS)[number];

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
  addWaterMeter: boolean;
  waterMeterNumber: string;
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
  addWaterMeter: false,
  waterMeterNumber: "",
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

export function isUnitDataComplete(unitData: UnitDataState) {
  return (
    isSelectFilled(unitData.unitTypeId) &&
    isSelectFilled(unitData.unitUsageId) &&
    isPositiveNumber(unitData.totalArea) &&
    isSelectFilled(unitData.floorNumber) &&
    unitData.unitNumber.trim() !== ""
  );
}

export function buildCountOptions(max = 20) {
  return Array.from({ length: max + 1 }, (_, index) => {
    const value = String(index);
    return { value, label: value };
  });
}
