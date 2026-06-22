export const UNIT_TYPE_OPTIONS = [
  "apartment",
  "villa",
  "floor",
  "studio",
  "office",
  "shop",
] as const;

export type UnitTypeOption = (typeof UNIT_TYPE_OPTIONS)[number];

export const UNIT_USAGE_OPTIONS = ["residential", "commercial"] as const;

export type UnitUsageOption = (typeof UNIT_USAGE_OPTIONS)[number];

export const FURNISHING_TYPE_OPTIONS = ["new", "used"] as const;

export type FurnishingTypeOption = (typeof FURNISHING_TYPE_OPTIONS)[number];

export type RentedUnitDataState = {
  unitType: UnitTypeOption | "";
  unitUsage: UnitUsageOption | "";
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

export const EMPTY_RENTED_UNIT_DATA: RentedUnitDataState = {
  unitType: "",
  unitUsage: "",
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

export const TENANT_STEP_PHASE_COUNT = 2;

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

export function isRentedUnitDataComplete(rentedUnitData: RentedUnitDataState) {
  const baseComplete =
    isSelectFilled(rentedUnitData.unitType) &&
    isSelectFilled(rentedUnitData.unitUsage) &&
    isPositiveNumber(rentedUnitData.totalArea) &&
    isSelectFilled(rentedUnitData.floorNumber) &&
    rentedUnitData.unitNumber.trim() !== "" &&
    isSelectFilled(rentedUnitData.roomsCount) &&
    isSelectFilled(rentedUnitData.hallsCount) &&
    isSelectFilled(rentedUnitData.majlisCount) &&
    isSelectFilled(rentedUnitData.kitchensCount) &&
    isSelectFilled(rentedUnitData.bathroomsCount) &&
    isSelectFilled(rentedUnitData.windowAcCount) &&
    isSelectFilled(rentedUnitData.splitAcCount);

  if (!baseComplete) {
    return false;
  }

  if (rentedUnitData.furnished && rentedUnitData.furnishingType === "") {
    return false;
  }

  if (
    rentedUnitData.addElectricityMeter &&
    rentedUnitData.electricityMeterNumber.trim() === ""
  ) {
    return false;
  }

  if (
    rentedUnitData.addWaterMeter &&
    rentedUnitData.waterMeterNumber.trim() === ""
  ) {
    return false;
  }

  return true;
}

export function buildCountOptions(max = 20) {
  return Array.from({ length: max + 1 }, (_, index) => {
    const value = String(index);
    return { value, label: value };
  });
}
