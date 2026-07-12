import type { BirthDateValue } from "@/features/create-contract/types/owner-step";
import type { TenantDataState } from "@/features/create-contract/types/tenant-step";
import { mapTenantDelegationToAuthorizationType } from "@/features/create-contract/utils/map-tenant-delegation-to-authorization-type";
import {
  formatPropertyOwnerMobileForApi,
  formatPropertyOwnerYear,
} from "@/features/create-property/utils/property-owner-api";

export type ContractStep4Payload = {
  contractId: number;
  tenantData: TenantDataState;
};

type Step4JsonValue = string | number;

function parseDatePart(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

function appendTenantAgentBirthDate(
  target: Record<string, Step4JsonValue>,
  birthDate: BirthDateValue,
) {
  target.dobof_property_tenant_agent_day = parseDatePart(birthDate.day);
  target.dobof_property_tenant_agent_month = parseDatePart(birthDate.month);
  target.dobof_property_tenant_agent_year = Number(
    formatPropertyOwnerYear(birthDate.year),
  );
  target.type_dob_tenant_agent = birthDate.calendarType;
}

function appendTenantAgentFields(
  target: Record<string, Step4JsonValue>,
  {
    idNumber,
    phone,
    birthDate,
  }: {
    idNumber: string;
    phone: string;
    birthDate: BirthDateValue;
  },
) {
  target.id_num_of_property_tenant_agent = idNumber.replace(/\D/g, "");
  target.mobile_of_property_tenant_agent = formatPropertyOwnerMobileForApi(phone);
  appendTenantAgentBirthDate(target, birthDate);
}

export function buildContractStep4Body({
  contractId,
  tenantData,
}: ContractStep4Payload) {
  const body: Record<string, Step4JsonValue> = {
    id: contractId,
  };

  if (tenantData.status === "individual") {
    const { individual } = tenantData;

    body.tenant_entity = "person";
    body.tenant_id_num = individual.idNumber.replace(/\D/g, "");
    body.tenant_dob_day = parseDatePart(individual.birthDate.day);
    body.tenant_dob_month = parseDatePart(individual.birthDate.month);
    body.tenant_dob_year = Number(formatPropertyOwnerYear(individual.birthDate.year));
    body.tenant_mobile = formatPropertyOwnerMobileForApi(individual.phone);
    body.type_tenant_dob = individual.birthDate.calendarType;

    return body;
  }

  if (tenantData.status === "establishment-or-company") {
    const { organization } = tenantData;

    body.tenant_entity = "institution";
    body.tenant_entity_unified_registry_number =
      organization.unifiedRecordNumber.replace(/\D/g, "");
    body.authorization_type = mapTenantDelegationToAuthorizationType(
      organization.delegationType as "owner-representative" | "agent-authorized",
    );
    appendTenantAgentFields(body, {
      idNumber: organization.ownerIdNumber,
      phone: organization.ownerPhone,
      birthDate: organization.ownerBirthDate,
    });

    return body;
  }

  return body;
}

export function appendContractStep4Fields(
  formData: FormData,
  payload: ContractStep4Payload,
) {
  const body = buildContractStep4Body(payload);

  for (const [key, value] of Object.entries(body)) {
    formData.append(key, String(value));
  }

  const powerOfAttorneyFile =
    payload.tenantData.organization.powerOfAttorneyFiles[0];

  if (powerOfAttorneyFile) {
    formData.append(
      "copy_of_the_authorization_or_agency",
      powerOfAttorneyFile,
    );
  }
}

export function hasContractStep4PowerOfAttorneyFile(
  tenantData: TenantDataState,
) {
  return (
    tenantData.status === "establishment-or-company" &&
    tenantData.organization.delegationType === "agent-authorized" &&
    tenantData.organization.powerOfAttorneyFiles.length > 0
  );
}
