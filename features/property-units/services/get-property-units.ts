"use server";

import { apiRequest } from "@/lib/api/api-request";
import type {
  PropertyUnitsApiResponse,
  PropertyWithUnitsApiData,
} from "@/features/property-units/types/property-units-api";

export async function getPropertyUnits(
  propertyId: number,
): Promise<PropertyWithUnitsApiData> {
  const response = await apiRequest<PropertyUnitsApiResponse>(
    `/realstate/units/${propertyId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch property units",
    );
  }

  return response.data.data;
}
