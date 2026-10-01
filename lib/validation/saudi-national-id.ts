/** Saudi national ID (starts with 1) or Iqama (starts with 2), 10 digits. */
const SAUDI_NATIONAL_ID_PATTERN = /^[12]\d{9}$/;

export function digitsOnlyNationalId(idNumber: string) {
  return idNumber.replace(/\D/g, "");
}

/** Empty is allowed. A started value must begin with 1 (national ID) or 2 (Iqama). */
export function isSaudiNationalIdPrefixValid(idNumber: string) {
  const digits = digitsOnlyNationalId(idNumber);

  if (digits.length === 0) {
    return true;
  }

  return digits.startsWith("1") || digits.startsWith("2");
}

export function isSaudiNationalIdComplete(idNumber: string) {
  return SAUDI_NATIONAL_ID_PATTERN.test(digitsOnlyNationalId(idNumber));
}
