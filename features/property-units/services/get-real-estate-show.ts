"use server";

import { apiRequest } from "@/lib/api/api-request";
import type {
  PropertyUnitsApiResponse,
  PropertyWithUnitsApiData,
} from "@/features/property-units/types/property-units-api";

export async function getRealEstateShow(
  propertyId: number,
): Promise<PropertyWithUnitsApiData> {
  const response = await apiRequest<PropertyUnitsApiResponse>(
    `/realstate/show/${propertyId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch property",
    );
  }

  return response.data.data;
}
