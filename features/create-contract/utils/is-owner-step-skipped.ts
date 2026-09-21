import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { isLeaseRenewalContract } from "@/features/create-contract/utils/is-lease-renewal-contract";
import { isSubleaseContract } from "@/features/create-contract/utils/is-sublease-contract";
import { requiresWaqfOwnerNazir } from "@/features/create-contract/utils/requires-waqf-owner-nazir";

type OwnerSkipState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
};

/**
 * Owner wizard step is skipped for lease renewal, sublease, and endowment
 * (waqf) deeds — the waqf nazir step replaces owner for endowment.
 */
export function isOwnerStepSkipped(state: OwnerSkipState) {
  return (
    isLeaseRenewalContract(state) ||
    isSubleaseContract(state) ||
    requiresWaqfOwnerNazir(state)
  );
}
