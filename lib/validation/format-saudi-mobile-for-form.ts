export const SAUDI_MOBILE_PREFIX = "05";
export const SAUDI_MOBILE_SUBSCRIBER_LENGTH = 8;
export const SAUDI_MOBILE_LENGTH = 10;

/**
 * Normalize any phone input to 05xxxxxxxx.
 * Collapses duplicated 05 prefixes (e.g. 0505... → 05...).
 */
export function toSaudiMobileInputValue(raw: string) {
  let digits = raw.replace(/\D/g, "");

  if (!digits || digits === "0" || digits === "5" || digits === "05") {
    return SAUDI_MOBILE_PREFIX;
  }

  if (digits.startsWith("00966")) {
    digits = digits.slice(5);
  } else if (digits.startsWith("966")) {
    digits = digits.slice(3);
  }

  while (digits.startsWith("05")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.startsWith("5") && digits.length >= 9) {
    digits = digits.slice(1);
  }

  return `${SAUDI_MOBILE_PREFIX}${digits.slice(0, SAUDI_MOBILE_SUBSCRIBER_LENGTH)}`;
}

/** Format API phone values for create-flow inputs as 05xxxxxxxx. */
export function formatSaudiMobileForForm(phone: string | null | undefined) {
  if (!phone) {
    return SAUDI_MOBILE_PREFIX;
  }

  return toSaudiMobileInputValue(phone);
}

/** Editable digits after the fixed 05 prefix. */
export function getSaudiMobileSubscriber(phone: string) {
  const full = toSaudiMobileInputValue(phone);
  return full.startsWith(SAUDI_MOBILE_PREFIX)
    ? full.slice(SAUDI_MOBILE_PREFIX.length)
    : full;
}

export function isSaudiMobilePrefixOnly(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 0 || digits === SAUDI_MOBILE_PREFIX;
}
