import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";

function parseCount(value: string) {
  const parsed = Number(value.replace(/\D/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseFloorNumber(value: string) {
  if (value === "ground") {
    return 0;
  }

  return parseCount(value);
}

function parseArea(value: string) {
  const parsed = Number(value.replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function buildUnitFieldsPayload(unitData: UnitDataState) {
  const roomsCount = parseCount(unitData.roomsCount);
  const hallsCount = parseCount(unitData.hallsCount);
  const kitchensCount = parseCount(unitData.kitchensCount);
  const bathroomsCount = parseCount(unitData.bathroomsCount);
  const windowAcCount = parseCount(unitData.windowAcCount);
  const splitAcCount = parseCount(unitData.splitAcCount);

  return {
    unit_type_id: Number(unitData.unitTypeId),
    unit_usage_id: Number(unitData.unitUsageId),
    unit_number: unitData.unitNumber.trim(),
    floor_number: parseFloorNumber(unitData.floorNumber),
    unit_area: parseArea(unitData.totalArea),
    Services: [] as [],
    tootal_rooms: roomsCount,
    number_of_rooms: roomsCount,
    The_number_of_halls: hallsCount,
    The_number_of_kitchens: kitchensCount,
    The_number_of_toilets: bathroomsCount,
    The_number_of_the_toilet: bathroomsCount,
    window_ac: windowAcCount,
    split_ac: splitAcCount,
    electricity_meter_number: unitData.addElectricityMeter
      ? unitData.electricityMeterNumber.trim()
      : "",
    water_meter_number: unitData.addWaterMeter
      ? unitData.waterMeterNumber.trim()
      : "",
    kitchen_tank: unitData.kitchenCabinetsInstalled,
    furnished: unitData.furnished,
    type_furnished: unitData.furnished && unitData.furnishingType === "new",
    electricity_meter: unitData.addElectricityMeter,
    water_meter: unitData.addWaterMeter,
  };
}

export function buildUnitApiPayload(
  propertyId: number,
  contractType: PropertyContractType,
  unitData: UnitDataState,
) {
  return {
    real_estates_units_id: propertyId,
    contract_type: contractType,
    ...buildUnitFieldsPayload(unitData),
  };
}
