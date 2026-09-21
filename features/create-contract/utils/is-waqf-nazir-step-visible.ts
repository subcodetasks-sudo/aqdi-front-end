import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { requiresWaqfOwnerNazir } from "@/features/create-contract/utils/requires-waqf-owner-nazir";

type WaqfNazirStepState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
};

/** Whether the independent waqf-nazir wizard step should appear. */
export function isWaqfNazirStepVisible(state: WaqfNazirStepState) {
  return requiresWaqfOwnerNazir(state);
}
