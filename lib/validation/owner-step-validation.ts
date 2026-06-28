export type OwnerBirthDateLike = {
  day: string;
  month: string;
  year: string;
};

export type OwnerDataLike = {
  fullName: string;
  idNumber: string;
  birthDate: OwnerBirthDateLike;
  phone: string;
  hasAgent: string;
};

export type AgentDataLike = {
  idNumber: string;
  birthDate: OwnerBirthDateLike;
  phone: string;
  powerOfAttorneyFiles: File[];
};

export type OwnerValidationIssue =
  | "fullName"
  | "idNumber"
  | "idNumberLength"
  | "birthDate"
  | "phone"
  | "phoneLength"
  | "hasAgent"
  | "powerOfAttorney";

function isBirthDateComplete(birthDate: OwnerBirthDateLike) {
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

export function isOwnerDataComplete(ownerData: OwnerDataLike) {
  return (
    ownerData.fullName.trim().length > 0 &&
    isIdNumberComplete(ownerData.idNumber) &&
    isBirthDateComplete(ownerData.birthDate) &&
    isPhoneComplete(ownerData.phone) &&
    ownerData.hasAgent !== ""
  );
}

export function isAgentDataComplete(agentData: AgentDataLike) {
  return (
    isIdNumberComplete(agentData.idNumber) &&
    isBirthDateComplete(agentData.birthDate) &&
    isPhoneComplete(agentData.phone) &&
    agentData.powerOfAttorneyFiles.length > 0
  );
}

export function getOwnerDataValidationIssues(
  ownerData: OwnerDataLike,
): OwnerValidationIssue[] {
  const issues: OwnerValidationIssue[] = [];

  if (ownerData.fullName.trim().length === 0) {
    issues.push("fullName");
  }

  const idDigits = ownerData.idNumber.replace(/\D/g, "");
  if (idDigits.length === 0) {
    issues.push("idNumber");
  } else if (idDigits.length !== 10) {
    issues.push("idNumberLength");
  }

  if (!isBirthDateComplete(ownerData.birthDate)) {
    issues.push("birthDate");
  }

  const phoneDigits = ownerData.phone.replace(/\D/g, "");
  if (phoneDigits.length === 0) {
    issues.push("phone");
  } else if (phoneDigits.length < 9) {
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

  const idDigits = agentData.idNumber.replace(/\D/g, "");
  if (idDigits.length === 0) {
    issues.push("idNumber");
  } else if (idDigits.length !== 10) {
    issues.push("idNumberLength");
  }

  if (!isBirthDateComplete(agentData.birthDate)) {
    issues.push("birthDate");
  }

  const phoneDigits = agentData.phone.replace(/\D/g, "");
  if (phoneDigits.length === 0) {
    issues.push("phone");
  } else if (phoneDigits.length < 9) {
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
) {
  const digits = idNumber.replace(/\D/g, "");
  if (digits.length === 0) {
    return undefined;
  }
  if (digits.length !== 10) {
    return messages.length;
  }
  return undefined;
}

export function getPhoneFieldError(
  phone: string,
  messages: { required: string; length: string },
) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 0) {
    return undefined;
  }
  if (digits.length < 9) {
    return messages.length;
  }
  return undefined;
}
