"use server";

import type { LocationLookupApiResponse } from "@/features/create-contract/types/location-lookup";
import { apiRequest } from "@/lib/api/api-request";

export async function getCities(regionId: number) {
  const response = await apiRequest<LocationLookupApiResponse>(
    `/cities?region_id=${regionId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch cities",
    );
  }

  return response.data.data;
}
