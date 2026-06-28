"use client";

import { CREATE_CONTRACT_STEPS } from "@/features/create-contract/types/create-contract-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useCreateContractSteps() {
  const currentStep = useCreateContractDraftStore((state) => state.currentStep);
  const goNextStep = useCreateContractDraftStore((state) => state.goNextStep);
  const goBackStep = useCreateContractDraftStore((state) => state.goBackStep);

  const currentStepIndex = CREATE_CONTRACT_STEPS.indexOf(currentStep);

  return {
    currentStep,
    currentStepIndex,
    goNext: goNextStep,
    goBack: goBackStep,
  };
}
