import { getSaudiNationalMobile } from "@/features/auth/utils/normalize-saudi-phone";
import type { PropertyBirthDateValue } from "@/features/create-property/types/owner-step";

export function formatPropertyOwnerMobileForApi(phone: string) {
  const national = getSaudiNationalMobile(phone);

  if (national) {
    return `0${national}`;
  }

  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? digits : `0${digits}`;
}

export function normalizePropertyOwnerIban(iban?: string | null) {
  return (iban ?? "").replace(/\s/g, "").toUpperCase();
}

export function isPropertyOwnerIbanComplete(iban?: string | null) {
  return /^SA\d{22}$/.test(normalizePropertyOwnerIban(iban));
}

export function formatPropertyOwnerDatePart(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.padStart(2, "0");
}

export function formatPropertyOwnerYear(value: string) {
  return value.replace(/\D/g, "");
}

export function appendPropertyOwnerBirthDate(
  formData: FormData,
  birthDate: PropertyBirthDateValue,
  {
    calendarField,
    dayField,
    monthField,
    yearField,
  }: {
    calendarField: string;
    dayField: string;
    monthField: string;
    yearField: string;
  },
) {
  formData.append(calendarField, birthDate.calendarType);
  formData.append(dayField, formatPropertyOwnerDatePart(birthDate.day));
  formData.append(monthField, formatPropertyOwnerDatePart(birthDate.month));
  formData.append(yearField, formatPropertyOwnerYear(birthDate.year));
}
