import type { PropertyUnitApiItem } from "@/features/property-units/types/property-units-api";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";

function displayCount(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return String(value);
}

function mapFloorNumber(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  if (value === "0") {
    return "ground";
  }

  return value;
}

function mapRoomsCount(unit: PropertyUnitApiItem) {
  return displayCount(unit.tootal_rooms ?? unit.number_of_rooms);
}

function mapBathroomsCount(unit: PropertyUnitApiItem) {
  return displayCount(unit.The_number_of_toilets ?? unit.The_number_of_the_toilet);
}

export function mapApiUnitToUnitData(unit: PropertyUnitApiItem): UnitDataState {
  const furnished = Boolean(unit.furnished);

  return {
    unitTypeId: unit.unit_type_id ? String(unit.unit_type_id) : "",
    unitUsageId: unit.unit_usage_id ? String(unit.unit_usage_id) : "",
    totalArea: displayCount(unit.unit_area),
    floorNumber: mapFloorNumber(unit.floor_number),
    unitNumber: displayCount(unit.unit_number),
    roomsCount: mapRoomsCount(unit),
    hallsCount: displayCount(unit.The_number_of_halls),
    kitchensCount: displayCount(unit.The_number_of_kitchens),
    bathroomsCount: mapBathroomsCount(unit),
    windowAcCount: displayCount(unit.window_ac),
    splitAcCount: displayCount(unit.split_ac),
    kitchenCabinetsInstalled: Boolean(unit.kitchen_tank),
    furnished,
    furnishingType: furnished
      ? unit.type_furnished
        ? "new"
        : "used"
      : "",
    addElectricityMeter: Boolean(unit.electricity_meter),
    electricityMeterNumber: displayCount(unit.electricity_meter_number),
    addWaterMeter: Boolean(unit.water_meter),
    waterMeterNumber: displayCount(unit.water_meter_number),
  };
}
