import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import {
  EMPTY_AGENT_DATA,
  EMPTY_OWNER_DATA,
  type AgentDataState,
  type CalendarType,
  type HasAgentOption,
  type OwnerDataState,
} from "@/features/create-contract/types/owner-step";
import type {
  UncompletedContractStep3,
} from "@/features/create-contract/types/uncompleted-contract";
import {
  formatContractPhoneForForm,
  parseContractBirthDate,
} from "@/features/create-contract/utils/build-existing-contract-draft";

// Backend `step` is the next step to complete (1-based across the API steps):
// step1 = deed instrument, step2 = national address, step3 = owner,
// step4 = tenant, step5 = rented unit, step6 = finance, step7 = payment.
export function mapBackendStepToWizardStep(step: number): CreateContractStep {
  if (step <= 2) {
    return "deed";
  }

  if (step === 3) {
    return "owner";
  }

  if (step === 4 || step === 5) {
    return "tenant";
  }

  if (step === 6) {
    return "finance";
  }

  if (step >= 7) {
    return "payment";
  }

  return "deed";
}

function hasAgentFromValue(value: number | boolean | null): HasAgentOption {
  return value === 1 || value === true ? "yes" : "no";
}

export function buildOwnerDataFromStep3(
  step3: UncompletedContractStep3,
): OwnerDataState {
  const calendarType: CalendarType = step3.type_dob_property_owner ?? "hijri";

  return {
    ...EMPTY_OWNER_DATA,
    fullName: step3.name_owner?.trim() ?? "",
    idNumber: step3.property_owner_id_num?.replace(/\D/g, "") ?? "",
    birthDate: parseContractBirthDate(step3.property_owner_dob, calendarType),
    phone: formatContractPhoneForForm(step3.property_owner_mobile),
    iban: step3.property_owner_iban ?? "",
    hasAgent: hasAgentFromValue(step3.add_legal_agent_of_owner),
  };
}

export function buildAgentDataFromStep3(
  step3: UncompletedContractStep3,
): AgentDataState {
  const calendarType: CalendarType =
    step3.type_dob_property_owner_agent ?? "gregorian";

  return {
    ...EMPTY_AGENT_DATA,
    idNumber: step3.id_num_of_property_owner_agent?.replace(/\D/g, "") ?? "",
    birthDate: parseContractBirthDate(
      step3.dob_of_property_owner_agent,
      calendarType,
    ),
    phone: formatContractPhoneForForm(step3.mobile_of_property_owner_agent),
    powerOfAttorneyFiles: [],
  };
}
