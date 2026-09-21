import { isSaudiMobilePrefixOnly } from "@/lib/validation/format-saudi-mobile-for-form";
import { isAdultBirthDateComplete } from "@/lib/validation/birth-date-year-options";
import {
  digitsOnlyNationalId,
  isSaudiNationalIdComplete,
} from "@/lib/validation/saudi-national-id";

export type OwnerBirthDateLike = {
  calendarType?: "hijri" | "gregorian";
  day: string;
  month: string;
  year: string;
};

export type OwnerDataLike = {
  idNumber: string;
  birthDate: OwnerBirthDateLike;
  phone: string;
  iban?: string;
  hasAgent: string;
};

export type AgentDataLike = {
  idNumber: string;
  birthDate: OwnerBirthDateLike;
  phone: string;
  powerOfAttorneyFiles: File[];
};

export type OwnerValidationIssue =
  | "idNumber"
  | "idNumberLength"
  | "birthDate"
  | "phone"
  | "phoneLength"
  | "iban"
  | "ibanInvalid"
  | "hasAgent"
  | "powerOfAttorney";

function isBirthDateComplete(birthDate: OwnerBirthDateLike) {
  if (birthDate.day === "" || birthDate.month === "" || birthDate.year === "") {
    return false;
  }

  return isAdultBirthDateComplete({
    calendarType: birthDate.calendarType ?? "hijri",
    day: birthDate.day,
    month: birthDate.month,
    year: birthDate.year,
  });
}

/** Saudi mobile as entered by the user: 05xxxxxxxx (10 digits). */
export function isPhoneComplete(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return /^05\d{8}$/.test(digits);
}

export function isOwnerDataComplete(ownerData: OwnerDataLike) {
  return (
    isSaudiNationalIdComplete(ownerData.idNumber) &&
    isBirthDateComplete(ownerData.birthDate) &&
    isPhoneComplete(ownerData.phone) &&
    ownerData.hasAgent !== ""
  );
}

export function isAgentDataComplete(agentData: AgentDataLike) {
  return (
    isSaudiNationalIdComplete(agentData.idNumber) &&
    isBirthDateComplete(agentData.birthDate) &&
    isPhoneComplete(agentData.phone) &&
    agentData.powerOfAttorneyFiles.length > 0
  );
}

export function getOwnerDataValidationIssues(
  ownerData: OwnerDataLike,
): OwnerValidationIssue[] {
  const issues: OwnerValidationIssue[] = [];

  const idDigits = digitsOnlyNationalId(ownerData.idNumber);
  if (idDigits.length === 0) {
    issues.push("idNumber");
  } else if (!isSaudiNationalIdComplete(ownerData.idNumber)) {
    issues.push("idNumberLength");
  }

  if (!isBirthDateComplete(ownerData.birthDate)) {
    issues.push("birthDate");
  }

  if (isSaudiMobilePrefixOnly(ownerData.phone)) {
    issues.push("phone");
  } else if (!isPhoneComplete(ownerData.phone)) {
    issues.push("phoneLength");
  }

  if (ownerData.hasAgent === "") {
    issues.push("hasAgent");
  }

  return issues;
}

export function getAgentDataValidationIssues(
  agentData: AgentDataLike,
): OwnerValidationIssue[] {
  const issues: OwnerValidationIssue[] = [];

  const idDigits = digitsOnlyNationalId(agentData.idNumber);
  if (idDigits.length === 0) {
    issues.push("idNumber");
  } else if (!isSaudiNationalIdComplete(agentData.idNumber)) {
    issues.push("idNumberLength");
  }

  if (!isBirthDateComplete(agentData.birthDate)) {
    issues.push("birthDate");
  }

  if (isSaudiMobilePrefixOnly(agentData.phone)) {
    issues.push("phone");
  } else if (!isPhoneComplete(agentData.phone)) {
    issues.push("phoneLength");
  }

  if (agentData.powerOfAttorneyFiles.length === 0) {
    issues.push("powerOfAttorney");
  }

  return issues;
}

export function getIdNumberFieldError(
  idNumber: string,
  messages: { required: string; length: string },
  options?: { showEmpty?: boolean },
) {
  const digits = digitsOnlyNationalId(idNumber);
  if (digits.length === 0) {
    return options?.showEmpty ? messages.required : undefined;
  }
  if (!isSaudiNationalIdComplete(idNumber)) {
    return messages.length;
  }
  return undefined;
}

export function getPhoneFieldError(
  phone: string,
  messages: { required: string; length: string },
  options?: { showEmpty?: boolean },
) {
  if (isSaudiMobilePrefixOnly(phone)) {
    return options?.showEmpty ? messages.required : undefined;
  }
  if (!isPhoneComplete(phone)) {
    return messages.length;
  }
  return undefined;
}
