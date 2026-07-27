"use client";

import { useAppSettings } from "@/features/settings/hooks/use-app-settings";
import {
  buildWhatsappHref,
  resolveSettingsWhatsappNumber,
} from "@/features/settings/utils/build-whatsapp-href";

export function useWhatsappHref(fallback = "https://wa.me/") {
  const settingsQuery = useAppSettings();

  return buildWhatsappHref(
    resolveSettingsWhatsappNumber(settingsQuery.data),
    fallback,
  );
}
