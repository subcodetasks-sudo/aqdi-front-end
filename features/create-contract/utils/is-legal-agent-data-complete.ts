import type { AgentDataState } from "@/features/create-contract/types/owner-step";
import { isAdultBirthDateComplete } from "@/lib/validation/birth-date-year-options";
import { isPhoneComplete } from "@/lib/validation/owner-step-validation";
import { isSaudiNationalIdComplete } from "@/lib/validation/saudi-national-id";

/**
 * Legal-agent completeness for contract step 2. Allows an existing POA URL
 * from step1 (`copy_power_of_attorney_from_heirs_to_agent`) instead of a new file.
 */
export function isLegalAgentDataComplete(
  agentData: AgentDataState,
  options?: { hasExistingPoa?: boolean },
) {
  return (
    isSaudiNationalIdComplete(agentData.idNumber) &&
    isAdultBirthDateComplete(agentData.birthDate) &&
    isPhoneComplete(agentData.phone) &&
    (agentData.powerOfAttorneyFiles.length > 0 ||
      Boolean(options?.hasExistingPoa))
  );
}
