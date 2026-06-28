"use server";

import { apiRequest } from "@/lib/api/api-request";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type {
  UnitLookupApiResponse,
  UnitLookupOption,
} from "@/features/create-unit/types/unit-option";

export async function getUnitTypes(
  contractType: PropertyContractType,
): Promise<UnitLookupOption[]> {
  const response = await apiRequest<UnitLookupApiResponse>(
    `/units-types?contract_type=${contractType}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch unit types",
    );
  }

  return response.data.data;
}
