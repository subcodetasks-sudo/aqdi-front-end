import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsWaqfOwner } from "@/features/create-contract/types/deed-type";

type WaqfNazirRequirementState = {
  selectedDeedType?: DeedTypeId | "" | string;
  instrumentType?: string | null;
};

const WAQF_NAZIR_INSTRUMENT_TYPE = "property_ownership_owner_is_endowment";

const NOT_WAQF_NAZIR_INSTRUMENT_TYPES = new Set([
  "property_ownership_owner_are_deceased",
  "property_ownership_owner_are_deceased_endowment",
  "property_ownership_owner_are_suspended",
]);

/**
 * Nazir identity is collected and sent only for "صك ملكية والمالك وقف"
 * (`waqf-owner` / `property_ownership_owner_is_endowment`).
 * Not for محجور عليه, deceased, or any other deed.
 */
export function requiresWaqfOwnerNazir({
  selectedDeedType,
  instrumentType,
}: WaqfNazirRequirementState) {
  if (instrumentType && NOT_WAQF_NAZIR_INSTRUMENT_TYPES.has(instrumentType)) {
    return false;
  }

  if (instrumentType === WAQF_NAZIR_INSTRUMENT_TYPE) {
    return true;
  }

  return deedTypeIsWaqfOwner(selectedDeedType ?? "");
}
