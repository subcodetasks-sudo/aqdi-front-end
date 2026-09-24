import type { DelegationTypeOption } from "@/features/create-contract/types/tenant-step";

const AUTHORIZATION_TYPE_BY_DELEGATION: Record<DelegationTypeOption, string> = {
  "owner-representative": "owner_and_representative_of_record",
  "agent-authorized": "agent_or_authorized_by_registry_owner",
};

const DELEGATION_BY_AUTHORIZATION_TYPE: Record<string, DelegationTypeOption> = {
  owner_and_representative_of_record: "owner-representative",
  agent_or_authorized_by_registry_owner: "agent-authorized",
  "owner-representative": "owner-representative",
  "agent-authorized": "agent-authorized",
};

export function mapTenantDelegationToAuthorizationType(
  delegationType: DelegationTypeOption,
) {
  return AUTHORIZATION_TYPE_BY_DELEGATION[delegationType];
}

export function mapAuthorizationTypeToTenantDelegation(
  authorizationType: string | null | undefined,
): DelegationTypeOption | "" {
  if (!authorizationType) {
    return "";
  }

  return DELEGATION_BY_AUTHORIZATION_TYPE[authorizationType] ?? "";
}
