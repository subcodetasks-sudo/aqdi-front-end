import {
  getAgentDataValidationIssues,
  getOwnerDataValidationIssues,
  isAgentDataComplete,
  isOwnerDataComplete,
  type OwnerValidationIssue,
} from "@/lib/validation/owner-step-validation";
import { isPropertyOwnerIbanComplete } from "@/features/create-property/utils/property-owner-api";

export const PROPERTY_HAS_AGENT_OPTIONS = ["yes", "no"] as const;

export type PropertyHasAgentOption =
  (typeof PROPERTY_HAS_AGENT_OPTIONS)[number];

export type PropertyCalendarType = "hijri" | "gregorian";

export type PropertyBirthDateValue = {
  calendarType: PropertyCalendarType;
  day: string;
  month: string;
  year: string;
};

export const EMPTY_PROPERTY_BIRTH_DATE: PropertyBirthDateValue = {
  calendarType: "hijri",
  day: "",
  month: "",
  year: "",
};

export type PropertyOwnerDataState = {
  fullName: string;
  idNumber: string;
  birthDate: PropertyBirthDateValue;
  phone: string;
  iban: string;
  hasAgent: PropertyHasAgentOption | "";
};

export type PropertyAgentDataState = {
  idNumber: string;
  birthDate: PropertyBirthDateValue;
  phone: string;
  powerOfAttorneyFiles: File[];
};

export const EMPTY_PROPERTY_OWNER_DATA: PropertyOwnerDataState = {
  fullName: "",
  idNumber: "",
  birthDate: EMPTY_PROPERTY_BIRTH_DATE,
  phone: "",
  iban: "",
  hasAgent: "",
};

export const EMPTY_PROPERTY_AGENT_DATA: PropertyAgentDataState = {
  idNumber: "",
  birthDate: { ...EMPTY_PROPERTY_BIRTH_DATE, calendarType: "gregorian" },
  phone: "",
  powerOfAttorneyFiles: [],
};

export const PROPERTY_OWNER_STEP_MAX_PHASE_COUNT = 2;

export type PropertyOwnerValidationIssue =
  | OwnerValidationIssue
  | "iban"
  | "ibanInvalid";

export function isPropertyOwnerDataComplete(ownerData: PropertyOwnerDataState) {
  return (
    isOwnerDataComplete(ownerData) && isPropertyOwnerIbanComplete(ownerData.iban)
  );
}

export function isPropertyAgentDataComplete(agentData: PropertyAgentDataState) {
  return (
    isAgentDataComplete(agentData) && agentData.powerOfAttorneyFiles.length === 1
  );
}

export function getPropertyOwnerValidationIssues(
  ownerData: PropertyOwnerDataState,
): PropertyOwnerValidationIssue[] {
  const issues = getOwnerDataValidationIssues(
    ownerData,
  ) as PropertyOwnerValidationIssue[];

  const iban = ownerData.iban ?? "";
  if (!iban.trim()) {
    issues.push("iban");
  } else if (!isPropertyOwnerIbanComplete(iban)) {
    issues.push("ibanInvalid");
  }

  return issues;
}

export function getPropertyAgentValidationIssues(
  agentData: PropertyAgentDataState,
): PropertyOwnerValidationIssue[] {
  const issues = getAgentDataValidationIssues(
    agentData,
  ) as PropertyOwnerValidationIssue[];

  if (
    agentData.powerOfAttorneyFiles.length > 0 &&
    agentData.powerOfAttorneyFiles.length !== 1
  ) {
    issues.push("powerOfAttorney");
  }

  return issues;
}

export function getPropertyOwnerStepPhaseCount(
  hasAgent: PropertyHasAgentOption | "",
) {
  return hasAgent === "yes" ? PROPERTY_OWNER_STEP_MAX_PHASE_COUNT : 1;
}

export type { OwnerValidationIssue };
