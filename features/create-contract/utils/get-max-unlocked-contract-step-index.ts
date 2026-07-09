import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import { CREATE_CONTRACT_STEPS } from "@/features/create-contract/types/create-contract-step";
import type { ContractSession } from "@/features/create-contract/types/contract-session";
import type { ContractStep2ApiData } from "@/features/create-contract/types/contract-step2-api";
import type { ContractStep3ApiData } from "@/features/create-contract/types/contract-step3-api";
import type { ContractStep5ApiData } from "@/features/create-contract/types/contract-step5-api";
import type { ContractStep6ApiData } from "@/features/create-contract/types/contract-step6-api";

type ContractStepProgressState = {
  currentStep: CreateContractStep;
  contractSession: ContractSession | null;
  contractStep2Data: ContractStep2ApiData | null;
  contractStep3Data: ContractStep3ApiData | null;
  contractStep5Data: ContractStep5ApiData | null;
  contractStep6Data: ContractStep6ApiData | null;
};

export function getMaxUnlockedContractStepIndex(state: ContractStepProgressState) {
  if (!state.contractSession) {
    return 0;
  }

  let maxIndex = CREATE_CONTRACT_STEPS.indexOf("deed");

  if ((state.contractStep2Data?.step ?? 0) >= 3) {
    maxIndex = CREATE_CONTRACT_STEPS.indexOf("owner");
  }

  if ((state.contractStep3Data?.step ?? 0) >= 4) {
    maxIndex = CREATE_CONTRACT_STEPS.indexOf("tenant");
  }

  if ((state.contractStep5Data?.step ?? 0) >= 6) {
    maxIndex = CREATE_CONTRACT_STEPS.indexOf("finance");
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
  const stepIndex = CREATE_CONTRACT_STEPS.indexOf(step);
  return stepIndex <= getMaxUnlockedContractStepIndex(state);
}
