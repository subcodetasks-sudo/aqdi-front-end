"use server";

import { cache } from "react";

import { CONTENT_PAGE_ENDPOINTS } from "@/features/content-pages/constants";
import type { ContentPageKey } from "@/features/content-pages/constants";
import type {
  ContentPageSeo,
  ContentPagesSeoApiResponse,
  ContentPagesSeoMap,
} from "@/features/content-pages/types/content-page-seo";
import { apiRequest } from "@/lib/api/api-request";

/**
 * Single public SEO fetch for home / about / faq / blogs / services.
 * Wrapped in React `cache()` so layout + page `generateMetadata` share one request.
 */
const fetchContentPages = cache(
  async function fetchContentPages(): Promise<ContentPagesSeoMap | null> {
    const response = await apiRequest<ContentPagesSeoApiResponse>(
      CONTENT_PAGE_ENDPOINTS.list,
      {
        method: "GET",
        next: { revalidate: 60 },
      },
    );

    if (!response.ok || !response.data?.success || !response.data.data) {
      return null;
    }

    return response.data.data;
  },
);

export async function getContentPages(): Promise<ContentPagesSeoMap | null> {
  return fetchContentPages();
}

export async function getContentPageSeo(
  page: ContentPageKey,
): Promise<ContentPageSeo | null> {
  const pages = await fetchContentPages();
  return pages?.[page] ?? null;
}
