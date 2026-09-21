import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsDeceasedOwner } from "@/features/create-contract/types/deed-type";

type LegalAgentRequirementState = {
  selectedDeedType?: DeedTypeId | "";
  instrumentType?: string | null;
  requiresDeceasedOwnerLegalAgent?: boolean | null;
  propertyOwnerIsDeceased?: boolean | null;
};

/**
 * Contract V2 step 2 collects the deceased-owner legal agent when any of these
 * flags/instrument types is set (from step1 / step2 / uncompleted-contract).
 */
export function requiresDeceasedOwnerLegalAgent({
  selectedDeedType,
  instrumentType,
  requiresDeceasedOwnerLegalAgent,
  propertyOwnerIsDeceased,
}: LegalAgentRequirementState) {
  if (requiresDeceasedOwnerLegalAgent === true) {
    return true;
  }

  if (propertyOwnerIsDeceased === true) {
    return true;
  }

  if (deedTypeIsDeceasedOwner(selectedDeedType ?? "")) {
    return true;
  }

  return (
    instrumentType === "property_ownership_owner_are_deceased" ||
    instrumentType === "property_ownership_owner_are_deceased_endowment"
  );
}
