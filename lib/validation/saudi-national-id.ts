/** Saudi national ID (starts with 1) or Iqama (starts with 2), 10 digits. */
const SAUDI_NATIONAL_ID_PATTERN = /^[12]\d{9}$/;

export function digitsOnlyNationalId(idNumber: string) {
  return idNumber.replace(/\D/g, "");
}

export function isSaudiNationalIdComplete(idNumber: string) {
  return SAUDI_NATIONAL_ID_PATTERN.test(digitsOnlyNationalId(idNumber));
}
