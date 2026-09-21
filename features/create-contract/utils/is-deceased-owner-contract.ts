import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsDeceasedOwner } from "@/features/create-contract/types/deed-type";

type DeceasedOwnerContractState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
};

export function isDeceasedOwnerContract({
  selectedDeedType,
  instrumentType,
}: DeceasedOwnerContractState) {
  if (deedTypeIsDeceasedOwner(selectedDeedType ?? "")) {
    return true;
  }

  return (
    instrumentType === "property_ownership_owner_are_deceased" ||
    instrumentType === "property_ownership_owner_are_deceased_endowment"
  );
}
