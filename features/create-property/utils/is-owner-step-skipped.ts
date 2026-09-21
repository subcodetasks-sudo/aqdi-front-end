import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";

type OwnerSkipState = {
  selectedDeedType?: PropertyDeedTypeId | "";
};

/**
 * No property deed types currently skip the owner wizard step.
 * Deceased-owner deeds keep the step but show agent fields only
 * (see `propertyDeedTypeIsDeceasedOwner` + owner step agent-only mode).
 */
export function isOwnerStepSkipped(_state: OwnerSkipState) {
  return false;
}
