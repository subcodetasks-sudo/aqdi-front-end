export function buildWhatsappHref(
  contactNumber: string | null | undefined,
  fallback = "https://wa.me/",
) {
  const raw = typeof contactNumber === "string" ? contactNumber.trim() : "";
  if (!raw) {
    return fallback;
  }

  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return fallback;
  }

  const normalized = digits.startsWith("966")
    ? digits
    : digits.startsWith("0")
      ? `966${digits.slice(1)}`
      : `966${digits}`;

  return `https://wa.me/${normalized}`;
}

export function resolveSettingsWhatsappNumber(
  settings:
    | {
        whatsapp_contact?: string | null;
        whatsapp?: string | null;
      }
    | null
    | undefined,
) {
  const contact = settings?.whatsapp_contact?.trim();
  if (contact) {
    return contact;
  }

  const whatsapp = settings?.whatsapp?.trim();
  return whatsapp || null;
}
