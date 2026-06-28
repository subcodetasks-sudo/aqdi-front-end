"use server";

import { apiRequest } from "@/lib/api/api-request";
import type {
  RealEstateIndexApiResponse,
  RealEstateListItem,
} from "@/features/my-properties/types/real-estate-list-item";

export async function getMyProperties(): Promise<RealEstateListItem[]> {
  const response = await apiRequest<RealEstateIndexApiResponse>(
    "/realstate/index",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch properties",
    );
  }

  return response.data.data;
}
