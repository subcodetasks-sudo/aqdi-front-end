import type { AppSettings } from "@/features/settings/types/app-settings";
import {
  buildWhatsappHref,
  resolveSettingsWhatsappNumber,
} from "@/features/settings/utils/build-whatsapp-href";

export type FooterSocialLink = {
  id: string;
  href: string;
  label: string;
};

function asAbsoluteUrl(value: string | null | undefined) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) {
    return null;
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return `https://${raw.replace(/^\/+/, "")}`;
}

function resolveSnapchatHref(value: string | null | undefined) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) {
    return null;
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const username = raw.replace(/^@/, "");
  return `https://www.snapchat.com/add/${username}`;
}

export function formatSaudiPhoneDisplay(contactNumber: string | null | undefined) {
  const raw = typeof contactNumber === "string" ? contactNumber.trim() : "";
  if (!raw) {
    return null;
  }

  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  const normalized = digits.startsWith("966")
    ? digits
    : digits.startsWith("0")
      ? `966${digits.slice(1)}`
      : `966${digits}`;

  if (normalized.length === 12) {
    return `+${normalized.slice(0, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5, 8)} ${normalized.slice(8)}`;
  }

  return `+${normalized}`;
}

export function resolveFooterPhone(
  settings: AppSettings | null | undefined,
  fallbackPhone: string,
) {
  const number = resolveSettingsWhatsappNumber(settings);
  return formatSaudiPhoneDisplay(number) ?? fallbackPhone;
}

export function resolveFooterPhoneHref(
  settings: AppSettings | null | undefined,
) {
  const number = resolveSettingsWhatsappNumber(settings);
  if (!number) {
    return null;
  }

  const digits = number.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  const normalized = digits.startsWith("966")
    ? digits
    : digits.startsWith("0")
      ? `966${digits.slice(1)}`
      : `966${digits}`;

  return `tel:+${normalized}`;
}

export function resolveFooterWhatsappHref(
  settings: AppSettings | null | undefined,
) {
  return buildWhatsappHref(resolveSettingsWhatsappNumber(settings));
}

export function resolveFooterSocialLinks(
  settings: AppSettings | null | undefined,
): FooterSocialLink[] {
  if (!settings) {
    return [];
  }

  const links: Array<FooterSocialLink | null> = [
    {
      id: "snapchat",
      href: resolveSnapchatHref(settings.snapchat) ?? "",
      label: "Snapchat",
    },
    {
      id: "instagram",
      href: asAbsoluteUrl(settings.instagram) ?? "",
      label: "Instagram",
    },
    {
      id: "tiktok",
      href: asAbsoluteUrl(settings.tiktok) ?? "",
      label: "TikTok",
    },
    {
      id: "twitter",
      href: asAbsoluteUrl(settings.twitter) ?? "",
      label: "X",
    },
    {
      id: "facebook",
      href: asAbsoluteUrl(settings.facebook) ?? "",
      label: "Facebook",
    },
    {
      id: "linkedin",
      href: asAbsoluteUrl(settings.linkedIn) ?? "",
      label: "LinkedIn",
    },
  ];

  return links.filter((link): link is FooterSocialLink => Boolean(link?.href));
}
