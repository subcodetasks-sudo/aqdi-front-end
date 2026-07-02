"use server";

import type { LocationLookupApiResponse } from "@/features/create-contract/types/location-lookup";
import { apiRequest } from "@/lib/api/api-request";

export async function getRegions() {
  const response = await apiRequest<LocationLookupApiResponse>("/regions", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch regions",
    );
  }

  return response.data.data;
}
