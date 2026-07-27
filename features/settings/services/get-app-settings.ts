"use server";

import type {
  AppSettings,
  AppSettingsApiResponse,
} from "@/features/settings/types/app-settings";
import { apiRequest } from "@/lib/api/api-request";

export async function getAppSettings(): Promise<AppSettings | null> {
  const response = await apiRequest<AppSettingsApiResponse>("/settings", {
    method: "GET",
    next: { revalidate: 60 },
  });

  if (!response.ok || !response.data?.success || !response.data.data) {
    return null;
  }

  return response.data.data;
}
