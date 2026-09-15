"use server";

import type {
  HomeContentApiResponse,
  HomeContentSections,
} from "@/features/home/types/home-content-api";
import { apiRequest } from "@/lib/api/api-request";

export async function getHomeContent(): Promise<HomeContentSections | null> {
  const response = await apiRequest<HomeContentApiResponse>(
    "/content-pages/home",
    {
      method: "GET",
      next: { revalidate: 60 },
    },
  );

  if (!response.ok || !response.data?.success || !response.data.data?.sections) {
    return null;
  }

  return response.data.data.sections;
}
