import {
  getAgentDataValidationIssues,
  getOwnerDataValidationIssues,
  isAgentDataComplete,
  isOwnerDataComplete,
  type OwnerValidationIssue,
} from "@/lib/validation/owner-step-validation";

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
  phone: "05",
  iban: "",
  hasAgent: "",
};

export const EMPTY_PROPERTY_AGENT_DATA: PropertyAgentDataState = {
  idNumber: "",
  birthDate: { ...EMPTY_PROPERTY_BIRTH_DATE, calendarType: "gregorian" },
  phone: "05",
  powerOfAttorneyFiles: [],
};

export const PROPERTY_OWNER_STEP_MAX_PHASE_COUNT = 2;

export type PropertyOwnerValidationIssue = OwnerValidationIssue;

export function isPropertyOwnerDataComplete(ownerData: PropertyOwnerDataState) {
  return isOwnerDataComplete(ownerData);
}

export function isPropertyAgentDataComplete(
  agentData: PropertyAgentDataState,
  options?: { allowExistingPowerOfAttorney?: boolean },
) {
  const hasPowerOfAttorney =
    agentData.powerOfAttorneyFiles.length === 1 ||
    Boolean(options?.allowExistingPowerOfAttorney);

  return isAgentDataComplete(agentData) && hasPowerOfAttorney;
}

export function getPropertyOwnerValidationIssues(
  ownerData: PropertyOwnerDataState,
): PropertyOwnerValidationIssue[] {
  return getOwnerDataValidationIssues(ownerData);
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
