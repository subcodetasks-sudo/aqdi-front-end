"use server";

import type {
  AboutContentApiResponse,
  AboutContentSections,
} from "@/features/about/types/about-content-api";
import { apiRequest } from "@/lib/api/api-request";

export async function getAboutContent(): Promise<AboutContentSections | null> {
  const response = await apiRequest<AboutContentApiResponse>(
    "/content-pages/about",
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
