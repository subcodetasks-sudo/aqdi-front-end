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
  hasAgent: "",
};

export const EMPTY_PROPERTY_AGENT_DATA: PropertyAgentDataState = {
  idNumber: "",
  birthDate: { ...EMPTY_PROPERTY_BIRTH_DATE, calendarType: "gregorian" },
  phone: "",
  powerOfAttorneyFiles: [],
};

export const PROPERTY_OWNER_STEP_MAX_PHASE_COUNT = 2;

export {
  getAgentDataValidationIssues as getPropertyAgentValidationIssues,
  getOwnerDataValidationIssues as getPropertyOwnerValidationIssues,
  isAgentDataComplete as isPropertyAgentDataComplete,
  isOwnerDataComplete as isPropertyOwnerDataComplete,
  type OwnerValidationIssue as PropertyOwnerValidationIssue,
} from "@/lib/validation/owner-step-validation";

export function getPropertyOwnerStepPhaseCount(
  hasAgent: PropertyHasAgentOption | "",
) {
  return hasAgent === "yes" ? PROPERTY_OWNER_STEP_MAX_PHASE_COUNT : 1;
}
