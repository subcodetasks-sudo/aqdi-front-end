import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsWaqfOwner } from "@/features/create-contract/types/deed-type";

type WaqfNazirRequirementState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
};

/**
 * Contract V2 step 2 collects the endowment (waqf) nazir when the deed owner
 * is an endowment — not for deceased-owner or normal electronic deeds.
 *
 * Distinct from `requiresDeceasedOwnerLegalAgent` (بيانات الوكيل الشرعي).
 */
export function requiresWaqfOwnerNazir({
  selectedDeedType,
  instrumentType,
}: WaqfNazirRequirementState) {
  if (instrumentType === "property_ownership_owner_are_deceased_endowment") {
    return false;
  }

  if (instrumentType === "property_ownership_owner_is_endowment") {
    return true;
  }

  // Suspended maps to the same waqf-owner UI as endowment.
  if (instrumentType === "property_ownership_owner_are_suspended") {
    return true;
  }

  return deedTypeIsWaqfOwner(selectedDeedType ?? "");
}
