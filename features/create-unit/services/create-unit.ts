"use server";

import { apiRequest } from "@/lib/api/api-request";
import { buildUnitsCreateApiPayload } from "@/features/create-unit/utils/build-unit-api-payload";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";

export type CreateUnitPayload = {
  propertyId: number;
  contractType: PropertyContractType;
  units: UnitDataState[];
};

type CreateUnitApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: {
    id: number;
  };
};

export async function createUnit({
  propertyId,
  contractType,
  units,
}: CreateUnitPayload) {
  const response = await apiRequest<CreateUnitApiResponse>("/unit/create", {
    method: "POST",
    body: JSON.stringify(buildUnitsCreateApiPayload(propertyId, contractType, units)),
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
