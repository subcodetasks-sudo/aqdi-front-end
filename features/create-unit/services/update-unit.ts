"use server";

import { apiRequest } from "@/lib/api/api-request";
import { buildUnitApiPayload } from "@/features/create-unit/utils/build-unit-api-payload";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";

export type UpdateUnitPayload = {
  unitId: number;
  propertyId: number;
  contractType: PropertyContractType;
  unitData: UnitDataState;
};

type UpdateUnitApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: {
    id: number;
  };
};

export async function updateUnit({
  unitId,
  propertyId,
  contractType,
  unitData,
}: UpdateUnitPayload) {
  const response = await apiRequest<UpdateUnitApiResponse>(
    `/unit/update/${unitId}`,
    {
      method: "POST",
      body: JSON.stringify(
        buildUnitApiPayload(propertyId, contractType, unitData),
      ),
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
    unitId: response.data.data?.id ?? unitId,
    message: response.data.message,
  };
}
