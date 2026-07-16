"use client";

import { CREATE_CONTRACT_STEPS } from "@/features/create-contract/types/create-contract-step";
import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import {
  canNavigateToContractStep,
  getMaxUnlockedContractStepIndex,
} from "@/features/create-contract/utils/get-max-unlocked-contract-step-index";

export function useCreateContractSteps() {
  const currentStep = useCreateContractDraftStore((state) => state.currentStep);
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const contractStep1Data = useCreateContractDraftStore(
    (state) => state.contractStep1Data,
  );
  const contractStep2Data = useCreateContractDraftStore((state) => state.contractStep2Data);
  const contractStep3Data = useCreateContractDraftStore((state) => state.contractStep3Data);
  const contractStep4Data = useCreateContractDraftStore(
    (state) => state.contractStep4Data,
  );
  const contractStep5Data = useCreateContractDraftStore((state) => state.contractStep5Data);
  const contractStep6Data = useCreateContractDraftStore((state) => state.contractStep6Data);
  const goNextStep = useCreateContractDraftStore((state) => state.goNextStep);
  const goBackStep = useCreateContractDraftStore((state) => state.goBackStep);
  const setCurrentStep = useCreateContractDraftStore((state) => state.setCurrentStep);

  const progressState = {
    currentStep,
    contractSession,
    selectedDeedType,
    contractStep1Data,
    contractStep2Data,
    contractStep3Data,
    contractStep4Data,
    contractStep5Data,
    contractStep6Data,
  };

  const currentStepIndex = CREATE_CONTRACT_STEPS.indexOf(currentStep);
  const maxUnlockedStepIndex = getMaxUnlockedContractStepIndex(progressState);

  function goToStep(step: CreateContractStep) {
    if (!canNavigateToContractStep(step, progressState)) {
      return;
    }

    setCurrentStep(step);
  }

  function isStepUnlocked(step: CreateContractStep) {
    return canNavigateToContractStep(step, progressState);
  }

  return {
    currentStep,
    currentStepIndex,
    maxUnlockedStepIndex,
    goNext: goNextStep,
    goBack: goBackStep,
    goToStep,
    isStepUnlocked,
  };
}
