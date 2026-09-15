import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsSublease } from "@/features/create-contract/types/deed-type";

type SubleaseContractState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
};

export function isSubleaseContract({
  selectedDeedType,
  instrumentType,
}: SubleaseContractState) {
  if (deedTypeIsSublease(selectedDeedType ?? "")) {
    return true;
  }

  return instrumentType === "sublease_agreement";
}
