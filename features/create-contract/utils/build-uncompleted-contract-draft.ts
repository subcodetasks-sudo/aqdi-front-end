import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
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
import { isOwnerStepSkipped } from "@/features/create-contract/utils/is-owner-step-skipped";
import { requiresWaqfOwnerNazir } from "@/features/create-contract/utils/requires-waqf-owner-nazir";

// Backend `step` is the next step to complete (1-based across the API steps):
// step1 = deed instrument, step2 = national address (+ nazir/legal agent),
// step3 = owner, step4 = tenant, step5 = rented unit, step6 = finance,
// step7 = payment.
export function mapBackendStepToWizardStep(
  step: number,
  options?: {
    selectedDeedType?: DeedTypeId | "";
    instrumentType?: string | null;
  },
): CreateContractStep {
  const skipState = {
    selectedDeedType: options?.selectedDeedType,
    instrumentType: options?.instrumentType,
  };
  const waqfNazir = requiresWaqfOwnerNazir(skipState);
  const ownerSkipped = isOwnerStepSkipped(skipState);

  // Address is still collected on the deed screen; nazir is the following wizard step.
  if (step <= 2) {
    return "deed";
  }

  if (step === 3) {
    // Endowment skips owner — after step2 (nazir identity) resume at tenant.
    if (waqfNazir || ownerSkipped) {
      return "tenant";
    }
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
    idNumber: step3.property_owner_id_num?.replace(/\D/g, "") ?? "",
    birthDate: parseContractBirthDate(step3.property_owner_dob, calendarType),
    phone: formatContractPhoneForForm(step3.property_owner_mobile),
    iban: step3.property_owner_iban ?? "",
    hasAgent: hasAgentFromValue(step3.add_legal_agent_of_owner),
  };
}

type LegalAgentPrefillSource = {
  id_num_of_property_owner_agent?: string | null;
  mobile_of_property_owner_agent?: string | null;
  type_dob_property_owner_agent?: CalendarType | null;
  dob_of_property_owner_agent?: string | null;
  dob_of_property_owner_agent_day?: string | null;
  dob_of_property_owner_agent_month?: string | null;
  dob_of_property_owner_agent_year?: string | null;
};

export function buildAgentDataFromLegalAgentSource(
  source: LegalAgentPrefillSource | null | undefined,
): AgentDataState {
  if (!source) {
    return { ...EMPTY_AGENT_DATA };
  }

  const calendarType: CalendarType =
    source.type_dob_property_owner_agent ?? "hijri";

  const combinedDob =
    source.dob_of_property_owner_agent ??
    (source.dob_of_property_owner_agent_day &&
    source.dob_of_property_owner_agent_month &&
    source.dob_of_property_owner_agent_year
      ? `${String(source.dob_of_property_owner_agent_day).padStart(2, "0")}-${String(source.dob_of_property_owner_agent_month).padStart(2, "0")}-${source.dob_of_property_owner_agent_year}`
      : null);

  return {
    ...EMPTY_AGENT_DATA,
    idNumber: source.id_num_of_property_owner_agent?.replace(/\D/g, "") ?? "",
    phone: formatContractPhoneForForm(
      source.mobile_of_property_owner_agent ?? null,
    ),
    birthDate: parseContractBirthDate(combinedDob, calendarType),
    powerOfAttorneyFiles: [],
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
