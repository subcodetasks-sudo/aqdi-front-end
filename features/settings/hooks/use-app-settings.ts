"use client";

import { useQuery } from "@tanstack/react-query";

import { appSettingsKeys } from "@/features/settings/query-keys";
import { getAppSettings } from "@/features/settings/services/get-app-settings";

export function useAppSettings() {
  return useQuery({
    queryKey: appSettingsKeys.detail(),
    queryFn: () => getAppSettings(),
  });
}
