export const SAUDI_MOBILE_PREFIX = "05";
export const SAUDI_MOBILE_SUBSCRIBER_LENGTH = 8;
export const SAUDI_MOBILE_LENGTH = 10;

/**
 * Normalize any phone input to 05xxxxxxxx.
 * Collapses duplicated 05 prefixes (e.g. 0505... → 05...).
 * Preserves a legitimate subscriber that starts with 0 (e.g. 0501234567).
 */
export function toSaudiMobileInputValue(raw: string) {
  let digits = raw.replace(/\D/g, "");

  if (!digits) {
    return SAUDI_MOBILE_PREFIX;
  }

  if (digits.startsWith("00966")) {
    digits = digits.slice(5);
  } else if (digits.startsWith("966")) {
    digits = digits.slice(3);
  }

  // User retyped/pasted "05" after the fixed prefix: 0505... → 05...
  while (digits.startsWith("0505")) {
    digits = `05${digits.slice(4)}`;
  }

  if (digits.startsWith(SAUDI_MOBILE_PREFIX)) {
    const subscriber = digits.slice(SAUDI_MOBILE_PREFIX.length);
    return `${SAUDI_MOBILE_PREFIX}${subscriber.slice(0, SAUDI_MOBILE_SUBSCRIBER_LENGTH)}`;
  }

  // National form without leading 0: 5xxxxxxxx
  if (digits.startsWith("5") && digits.length >= 9) {
    return `${SAUDI_MOBILE_PREFIX}${digits.slice(1, 1 + SAUDI_MOBILE_SUBSCRIBER_LENGTH)}`;
  }

  return `${SAUDI_MOBILE_PREFIX}${digits.slice(0, SAUDI_MOBILE_SUBSCRIBER_LENGTH)}`;
}

/**
 * Normalize digits typed into the subscriber input (after the fixed 05 prefix).
 * Strips a leading 05 if the user pasted or retyped the full local number.
 */
export function toSaudiMobileFromSubscriberInput(raw: string) {
  let digits = raw.replace(/\D/g, "");

  while (digits.startsWith(SAUDI_MOBILE_PREFIX)) {
    digits = digits.slice(SAUDI_MOBILE_PREFIX.length);
  }

  return toSaudiMobileInputValue(`${SAUDI_MOBILE_PREFIX}${digits}`);
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
