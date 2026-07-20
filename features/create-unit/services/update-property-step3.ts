"use server";

import { buildRealEstateStep3Payload } from "@/features/create-unit/utils/build-unit-api-payload";
import type { RealEstateStep3ApiResponse } from "@/features/create-unit/types/real-estate-step3";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import { apiRequest } from "@/lib/api/api-request";

export type UpdatePropertyStep3Payload = {
  propertyId: number;
  units: UnitDataState[];
};

export async function updatePropertyStep3({
  propertyId,
  units,
}: UpdatePropertyStep3Payload) {
  const response = await apiRequest<RealEstateStep3ApiResponse>(
    "/realstate/update/step3",
    {
      method: "POST",
      body: JSON.stringify(buildRealEstateStep3Payload(propertyId, units)),
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Something went wrong",
    };
  }

  return {
    ok: true as const,
    message: response.data.message,
    unitsCount:
      response.data.units_count ??
      response.data.data?.units_count ??
      units.length,
  };
}
