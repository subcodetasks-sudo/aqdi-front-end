"use server";

import { getAppSettings } from "@/features/settings/services/get-app-settings";
import {
  buildWhatsappHref,
  resolveSettingsWhatsappNumber,
} from "@/features/settings/utils/build-whatsapp-href";

export async function getWhatsappHref(fallback = "https://wa.me/") {
  const settings = await getAppSettings();
  return buildWhatsappHref(resolveSettingsWhatsappNumber(settings), fallback);
}
