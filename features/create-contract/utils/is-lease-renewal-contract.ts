import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsLeaseRenewal } from "@/features/create-contract/types/deed-type";

type LeaseRenewalContractState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
};

export function isLeaseRenewalContract({
  selectedDeedType,
  instrumentType,
}: LeaseRenewalContractState) {
  if (deedTypeIsLeaseRenewal(selectedDeedType ?? "")) {
    return true;
  }

  return instrumentType === "lease_renewal";
}
