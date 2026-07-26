import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { isLeaseRenewalContract } from "@/features/create-contract/utils/is-lease-renewal-contract";
import { isSubleaseContract } from "@/features/create-contract/utils/is-sublease-contract";

type OwnerSkipState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
};

/** Lease renewal and sublease both skip the owner wizard step. */
export function isOwnerStepSkipped(state: OwnerSkipState) {
  return (
    isLeaseRenewalContract(state) || isSubleaseContract(state)
  );
}
