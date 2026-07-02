import type { DelegationTypeOption } from "@/features/create-contract/types/tenant-step";

const AUTHORIZATION_TYPE_BY_DELEGATION: Record<DelegationTypeOption, string> = {
  "owner-representative": "owner_and_representative_of_record",
  "agent-authorized": "agent_or_authorized_by_registry_owner",
};

export function mapTenantDelegationToAuthorizationType(
  delegationType: DelegationTypeOption,
) {
  return AUTHORIZATION_TYPE_BY_DELEGATION[delegationType];
}
