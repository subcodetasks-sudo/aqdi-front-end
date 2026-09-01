"use server";

import { getToken } from "@/actions/auth";
import { apiRequest } from "@/lib/api/api-request";
import type {
  RealEstateIndexApiResponse,
  RealEstateListItem,
} from "@/features/my-properties/types/real-estate-list-item";

export async function getMyProperties(): Promise<RealEstateListItem[]> {
  // No auth cookie — the caller isn't signed in, so there are no "my"
  // properties. Skip the request entirely instead of letting the backend
  // reject it with a 403.
  const token = await getToken();
  if (!token) {
    return [];
  }

  const response = await apiRequest<RealEstateIndexApiResponse>(
    "/realstate/index",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  // A 403 ("ليس لديك صلاحية") just means the current user has no properties /
  // isn't a landlord — that's an empty list, not a failure. Returning here also
  // keeps the rejection from crossing the "use server" boundary and spamming
  // the server console even though every caller already treats it as empty.
  if (response.status === 403) {
    return [];
  }

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch properties",
    );
  }

  return response.data.data;
}
