import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import { CREATE_CONTRACT_STEPS } from "@/features/create-contract/types/create-contract-step";
import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type { ContractSession } from "@/features/create-contract/types/contract-session";
import type { ContractStep1ApiData } from "@/features/create-contract/types/contract-step1-api";
import type { ContractStep2ApiData } from "@/features/create-contract/types/contract-step2-api";
import type { ContractStep3ApiData } from "@/features/create-contract/types/contract-step3-api";
import type { ContractStep4ApiData } from "@/features/create-contract/types/contract-step4-api";
import type { ContractStep5ApiData } from "@/features/create-contract/types/contract-step5-api";
import type { ContractStep6ApiData } from "@/features/create-contract/types/contract-step6-api";
import { isLeaseRenewalContract } from "@/features/create-contract/utils/is-lease-renewal-contract";
import { isOwnerStepSkipped } from "@/features/create-contract/utils/is-owner-step-skipped";
import { isSubleaseContract } from "@/features/create-contract/utils/is-sublease-contract";

type ContractStepProgressState = {
  currentStep: CreateContractStep;
  contractSession: ContractSession | null;
  selectedDeedType: DeedTypeId | "";
  contractStep1Data: ContractStep1ApiData | null;
  contractStep2Data: ContractStep2ApiData | null;
  contractStep3Data: ContractStep3ApiData | null;
  contractStep4Data: ContractStep4ApiData | null;
  contractStep5Data: ContractStep5ApiData | null;
  contractStep6Data: ContractStep6ApiData | null;
};

function getSkipOwnerProgressState(state: ContractStepProgressState) {
  return {
    selectedDeedType: state.selectedDeedType,
    instrumentType: state.contractStep1Data?.instrument_type,
  };
}

export function getMaxUnlockedContractStepIndex(state: ContractStepProgressState) {
  if (!state.contractSession) {
    return 0;
  }

  const skipState = getSkipOwnerProgressState(state);
  const leaseRenewal = isLeaseRenewalContract(skipState);
  const sublease = isSubleaseContract(skipState);

  let maxIndex = CREATE_CONTRACT_STEPS.indexOf("deed");

  if (leaseRenewal) {
    if ((state.contractStep1Data?.step ?? 0) >= 4) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("tenant");
    }

    if ((state.contractStep4Data?.step ?? 0) >= 5) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("finance");
    }

    if ((state.contractStep5Data?.step ?? 0) >= 6) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("finance");
    }
  } else if (sublease) {
    // Sublease has no national address / owner steps — deed unlocks tenant.
    if (state.contractStep1Data) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("tenant");
    }

    if ((state.contractStep4Data?.step ?? 0) >= 5) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("finance");
    }

    if ((state.contractStep5Data?.step ?? 0) >= 6) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("finance");
    }
  } else {
    if ((state.contractStep2Data?.step ?? 0) >= 3) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("owner");
    }

    if ((state.contractStep3Data?.step ?? 0) >= 4) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("tenant");
    }

    if ((state.contractStep5Data?.step ?? 0) >= 6) {
      maxIndex = CREATE_CONTRACT_STEPS.indexOf("finance");
    }
  }

  if ((state.contractStep6Data?.step ?? 0) >= 7) {
    maxIndex = CREATE_CONTRACT_STEPS.indexOf("payment");
  }

  const currentStepIndex = CREATE_CONTRACT_STEPS.indexOf(state.currentStep);

  return Math.max(maxIndex, currentStepIndex);
}

export function canNavigateToContractStep(
  step: CreateContractStep,
  state: ContractStepProgressState,
) {
  if (step === "owner" && isOwnerStepSkipped(getSkipOwnerProgressState(state))) {
    return false;
  }

  const stepIndex = CREATE_CONTRACT_STEPS.indexOf(step);
  return stepIndex <= getMaxUnlockedContractStepIndex(state);
}
