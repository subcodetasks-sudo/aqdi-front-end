"use server";

import { apiRequest } from "@/lib/api/api-request";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";

export type CreateUnitPayload = {
  propertyId: number;
  unitData: UnitDataState;
};

type CreateUnitApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: {
    id: number;
  };
};

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

export async function createUnit({ propertyId, unitData }: CreateUnitPayload) {
  const roomsCount = parseCount(unitData.roomsCount);
  const hallsCount = parseCount(unitData.hallsCount);
  const kitchensCount = parseCount(unitData.kitchensCount);
  const bathroomsCount = parseCount(unitData.bathroomsCount);
  const windowAcCount = parseCount(unitData.windowAcCount);
  const splitAcCount = parseCount(unitData.splitAcCount);

  const response = await apiRequest<CreateUnitApiResponse>("/unit/create", {
    method: "POST",
    body: JSON.stringify({
      real_estates_units_id: propertyId,
      unit_type_id: Number(unitData.unitTypeId),
      unit_usage_id: Number(unitData.unitUsageId),
      unit_number: unitData.unitNumber.trim(),
      floor_number: parseFloorNumber(unitData.floorNumber),
      unit_area: parseArea(unitData.totalArea),
      Services: [],
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
    }),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Something went wrong",
    };
  }

  return {
    ok: true as const,
    unitId: response.data.data?.id,
    message: response.data.message,
  };
}
