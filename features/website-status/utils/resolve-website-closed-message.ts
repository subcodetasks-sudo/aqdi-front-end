import type { WebsiteStatus } from "@/features/website-status/types/website-status";

type Fallbacks = {
  ar: string;
  en: string;
};

/**
 * Picks the maintenance message to show, preferring the locale-specific text
 * from the backend and falling back to the bundled translation when the API
 * sends nothing.
 */
export function resolveWebsiteClosedMessage(
  status: Pick<WebsiteStatus, "messageAr" | "messageEn">,
  locale: string,
  fallbacks: Fallbacks,
): string {
  const isArabic = locale.toLowerCase().split("-")[0] === "ar";

  if (isArabic) {
    return status.messageAr ?? status.messageEn ?? fallbacks.ar;
  }

  return status.messageEn ?? status.messageAr ?? fallbacks.en;
}
