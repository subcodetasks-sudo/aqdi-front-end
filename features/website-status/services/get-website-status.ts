"use server";

import {
  BASE_URL,
  WEBSITE_CLIENT_HEADER,
  WEBSITE_CLIENT_ID,
} from "@/lib/api/constants";
import type {
  WebsiteStatus,
  WebsiteStatusApiResponse,
} from "@/features/website-status/types/website-status";

const WEBSITE_STATUS_ENDPOINT = "/website-status";

const OPEN: WebsiteStatus = {
  isOpen: true,
  messageAr: null,
  messageEn: null,
};

/**
 * Boot check for the web SPA. Called before rendering routes (root layout) and
 * by the maintenance page. Uses a bare `fetch` — not `apiRequest` — so it stays
 * unauthenticated and is not itself caught by the 503 redirect interceptor.
 *
 * Fails open: a network/parse error is not a closure signal.
 */
export async function getWebsiteStatus(): Promise<WebsiteStatus> {
  try {
    const response = await fetch(`${BASE_URL}${WEBSITE_STATUS_ENDPOINT}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        [WEBSITE_CLIENT_HEADER]: WEBSITE_CLIENT_ID,
      },
      cache: "no-store",
    });

    const body = (await response
      .json()
      .catch(() => null)) as WebsiteStatusApiResponse | null;
    const data = body?.data;

    const isOpen = response.status !== 503 && data?.is_open !== false;

    if (isOpen) {
      return OPEN;
    }

    return {
      isOpen: false,
      messageAr: data?.message_ar ?? data?.message ?? body?.message ?? null,
      messageEn: data?.message_en ?? null,
    };
  } catch {
    return OPEN;
  }
}
