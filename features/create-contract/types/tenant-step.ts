import {
  EMPTY_BIRTH_DATE,
  type BirthDateValue,
} from "@/features/create-contract/types/owner-step";

export const TENANT_STATUS_OPTIONS = [
  "individual",
  "establishment-or-company",
] as const;

export type TenantStatusOption = (typeof TENANT_STATUS_OPTIONS)[number];

export const DELEGATION_TYPE_OPTIONS = [
  "owner-representative",
  "agent-authorized",
] as const;

export type DelegationTypeOption = (typeof DELEGATION_TYPE_OPTIONS)[number];

export type IndividualTenantData = {
  idNumber: string;
  birthDate: BirthDateValue;
  phone: string;
};

export const EMPTY_INDIVIDUAL_TENANT_DATA: IndividualTenantData = {
  idNumber: "",
  birthDate: EMPTY_BIRTH_DATE,
  phone: "",
};

export type OrganizationTenantData = {
  delegationType: DelegationTypeOption | "";
  unifiedRecordNumber: string;
  ownerIdNumber: string;
  ownerBirthDate: BirthDateValue;
  ownerPhone: string;
  powerOfAttorneyFiles: File[];
};

export const EMPTY_ORGANIZATION_TENANT_DATA: OrganizationTenantData = {
  delegationType: "",
  unifiedRecordNumber: "",
  ownerIdNumber: "",
  ownerBirthDate: EMPTY_BIRTH_DATE,
  ownerPhone: "",
  powerOfAttorneyFiles: [],
};

export type TenantDataState = {
  status: TenantStatusOption | "";
  individual: IndividualTenantData;
  organization: OrganizationTenantData;
};

export const EMPTY_TENANT_DATA: TenantDataState = {
  status: "",
  individual: EMPTY_INDIVIDUAL_TENANT_DATA,
  organization: EMPTY_ORGANIZATION_TENANT_DATA,
};

export function isOrganizationTenantStatus(status: TenantStatusOption | "") {
  return status === "establishment-or-company";
}

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

function isUnifiedRecordNumberComplete(unifiedRecordNumber: string) {
  const digits = unifiedRecordNumber.replace(/\D/g, "");
  return digits.length === 10 && digits.startsWith("7");
}

function isIndividualTenantComplete(individual: IndividualTenantData) {
  return (
    isIdNumberComplete(individual.idNumber) &&
    isBirthDateComplete(individual.birthDate) &&
    isPhoneComplete(individual.phone)
  );
}

function isOrganizationTenantComplete(organization: OrganizationTenantData) {
  const baseComplete =
    organization.delegationType !== "" &&
    isUnifiedRecordNumberComplete(organization.unifiedRecordNumber) &&
    isIdNumberComplete(organization.ownerIdNumber) &&
    isBirthDateComplete(organization.ownerBirthDate) &&
    isPhoneComplete(organization.ownerPhone);

  if (!baseComplete) {
    return false;
  }

  if (organization.delegationType === "agent-authorized") {
    return organization.powerOfAttorneyFiles.length > 0;
  }

  return true;
}

export function isTenantDataComplete(tenantData: TenantDataState) {
  if (tenantData.status === "") {
    return false;
  }

  if (tenantData.status === "individual") {
    return isIndividualTenantComplete(tenantData.individual);
  }

  if (isOrganizationTenantStatus(tenantData.status)) {
    return isOrganizationTenantComplete(tenantData.organization);
  }

  return false;
}
