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

function isBirthDateComplete(birthDate: PropertyBirthDateValue) {
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

export function isPropertyOwnerDataComplete(
  ownerData: PropertyOwnerDataState,
) {
  return (
    ownerData.fullName.trim().length > 0 &&
    isIdNumberComplete(ownerData.idNumber) &&
    isBirthDateComplete(ownerData.birthDate) &&
    isPhoneComplete(ownerData.phone) &&
    ownerData.hasAgent !== ""
  );
}

export function isPropertyAgentDataComplete(
  agentData: PropertyAgentDataState,
) {
  return (
    isIdNumberComplete(agentData.idNumber) &&
    isBirthDateComplete(agentData.birthDate) &&
    isPhoneComplete(agentData.phone) &&
    agentData.powerOfAttorneyFiles.length > 0
  );
}

export function getPropertyOwnerStepPhaseCount(
  hasAgent: PropertyHasAgentOption | "",
) {
  return hasAgent === "yes" ? PROPERTY_OWNER_STEP_MAX_PHASE_COUNT : 1;
}
