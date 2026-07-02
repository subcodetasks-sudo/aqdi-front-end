import {
  getAgentDataValidationIssues as getContractAgentValidationIssues,
  getOwnerDataValidationIssues as getContractOwnerValidationIssues,
  isAgentDataComplete,
  isOwnerDataComplete as isBaseOwnerDataComplete,
  type OwnerValidationIssue as ContractOwnerValidationIssue,
} from "@/lib/validation/owner-step-validation";
import { isPropertyOwnerIbanComplete } from "@/features/create-property/utils/property-owner-api";

export const HAS_AGENT_OPTIONS = ["yes", "no"] as const;

export type HasAgentOption = (typeof HAS_AGENT_OPTIONS)[number];

export type CalendarType = "hijri" | "gregorian";

export type BirthDateValue = {
  calendarType: CalendarType;
  day: string;
  month: string;
  year: string;
};

export const EMPTY_BIRTH_DATE: BirthDateValue = {
  calendarType: "hijri",
  day: "",
  month: "",
  year: "",
};

export type OwnerDataState = {
  fullName: string;
  idNumber: string;
  birthDate: BirthDateValue;
  phone: string;
  iban: string;
  hasAgent: HasAgentOption | "";
};

export type AgentDataState = {
  idNumber: string;
  birthDate: BirthDateValue;
  phone: string;
  powerOfAttorneyFiles: File[];
};

export const EMPTY_OWNER_DATA: OwnerDataState = {
  fullName: "",
  idNumber: "",
  birthDate: EMPTY_BIRTH_DATE,
  phone: "",
  iban: "",
  hasAgent: "",
};

export const EMPTY_AGENT_DATA: AgentDataState = {
  idNumber: "",
  birthDate: { ...EMPTY_BIRTH_DATE, calendarType: "gregorian" },
  phone: "",
  powerOfAttorneyFiles: [],
};

export const OWNER_STEP_MAX_PHASE_COUNT = 2;

export function isOwnerDataComplete(ownerData: OwnerDataState) {
  return (
    isBaseOwnerDataComplete(ownerData) && isPropertyOwnerIbanComplete(ownerData.iban)
  );
}

export {
  getContractAgentValidationIssues,
  getContractOwnerValidationIssues,
  isAgentDataComplete,
  type ContractOwnerValidationIssue,
};

export function getOwnerStepPhaseCount(hasAgent: HasAgentOption | "") {
  return hasAgent === "yes" ? OWNER_STEP_MAX_PHASE_COUNT : 1;
}
