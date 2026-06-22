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
  hasAgent: "",
};

export const EMPTY_AGENT_DATA: AgentDataState = {
  idNumber: "",
  birthDate: { ...EMPTY_BIRTH_DATE, calendarType: "gregorian" },
  phone: "",
  powerOfAttorneyFiles: [],
};

export const OWNER_STEP_MAX_PHASE_COUNT = 2;

function isBirthDateComplete(birthDate: BirthDateValue) {
  return (
    birthDate.day !== "" && birthDate.month !== "" && birthDate.year !== ""
  );
}

function isPhoneComplete(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9;
}

function isIdNumberComplete(idNumber: string) {
  const digits = idNumber.replace(/\D/g, "");
  return digits.length === 10;
}

export function isOwnerDataComplete(ownerData: OwnerDataState) {
  return (
    ownerData.fullName.trim().length > 0 &&
    isIdNumberComplete(ownerData.idNumber) &&
    isBirthDateComplete(ownerData.birthDate) &&
    isPhoneComplete(ownerData.phone) &&
    ownerData.hasAgent !== ""
  );
}

export function isAgentDataComplete(agentData: AgentDataState) {
  return (
    isIdNumberComplete(agentData.idNumber) &&
    isBirthDateComplete(agentData.birthDate) &&
    isPhoneComplete(agentData.phone) &&
    agentData.powerOfAttorneyFiles.length > 0
  );
}

export function getOwnerStepPhaseCount(hasAgent: HasAgentOption | "") {
  return hasAgent === "yes" ? OWNER_STEP_MAX_PHASE_COUNT : 1;
}
