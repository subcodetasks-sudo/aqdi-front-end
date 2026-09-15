"use server";

import { cache } from "react";

import type {
  AppSettings,
  AppSettingsApiResponse,
} from "@/features/settings/types/app-settings";
import { apiRequest } from "@/lib/api/api-request";
import { sanitizeRichText } from "@/lib/security/sanitize-rich-text";

const fetchAppSettings = cache(async function fetchAppSettings(): Promise<AppSettings | null> {
  const response = await apiRequest<AppSettingsApiResponse>("/settings", {
    method: "GET",
    next: { revalidate: 60 },
  });

  if (!response.ok || !response.data?.success || !response.data.data) {
    return null;
  }

  const settings = response.data.data;

  // Terms/privacy are CMS HTML rendered with dangerouslySetInnerHTML.
  return {
    ...settings,
    terms: {
      ...settings.terms,
      description: sanitizeRichText(settings.terms?.description ?? ""),
    },
    privacy: {
      ...settings.privacy,
      description: sanitizeRichText(settings.privacy?.description ?? ""),
    },
  };
});

export async function getAppSettings(): Promise<AppSettings | null> {
  return fetchAppSettings();
}
