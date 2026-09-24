import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsDeceasedOwner } from "@/features/create-contract/types/deed-type";
import { mapInstrumentTypeToDeedType } from "@/features/create-contract/utils/map-instrument-type-to-deed-type";

type LegalAgentRequirementState = {
  selectedDeedType?: DeedTypeId | "" | string;
  instrumentType?: string | null;
  instrumentTypeTrans?: string | null;
  deedOwnerIsDeceased?: boolean;
  requiresDeceasedOwnerLegalAgent?: boolean | number | null;
  propertyOwnerIsDeceased?: boolean | number | null;
  hasDeceasedDeedAttachments?: boolean;
};

function isTruthyFlag(value: boolean | number | null | undefined) {
  return value === true || value === 1;
}

function instrumentLooksDeceased(
  instrumentType?: string | null,
  instrumentTypeTrans?: string | null,
) {
  if (deedTypeIsDeceasedOwner(instrumentType ?? "")) {
    return true;
  }

  if (deedTypeIsDeceasedOwner(mapInstrumentTypeToDeedType(instrumentType))) {
    return true;
  }

  const trans = instrumentTypeTrans ?? "";
  return trans.includes("متوفي") || trans.includes("متوفى");
}

/**
 * For "صك ملكية والمالك متوفي" there is no living owner.
 * The wizard owner slot is الوكيل الشرعي and we never send property_owner_*.
 */
export function requiresDeceasedOwnerLegalAgent({
  selectedDeedType,
  instrumentType,
  instrumentTypeTrans,
  deedOwnerIsDeceased = false,
  requiresDeceasedOwnerLegalAgent: apiRequiresLegalAgent,
  propertyOwnerIsDeceased,
  hasDeceasedDeedAttachments = false,
}: LegalAgentRequirementState) {
  if (deedOwnerIsDeceased) {
    return true;
  }

  if (deedTypeIsDeceasedOwner(selectedDeedType ?? "")) {
    return true;
  }

  if (instrumentLooksDeceased(instrumentType, instrumentTypeTrans)) {
    return true;
  }

  if (isTruthyFlag(apiRequiresLegalAgent) || isTruthyFlag(propertyOwnerIsDeceased)) {
    return true;
  }

  return hasDeceasedDeedAttachments;
}
