import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { requiresWaqfOwnerNazir } from "@/features/create-contract/utils/requires-waqf-owner-nazir";

type WaqfNazirStepState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
};

/** Independent nazir step — only "صك ملكية والمالك وقف". */
export function isWaqfNazirStepVisible(state: WaqfNazirStepState) {
  return requiresWaqfOwnerNazir(state);
}
