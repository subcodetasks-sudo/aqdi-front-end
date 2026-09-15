"use client";

import {
  CREATE_PROPERTY_STEPS,
} from "@/features/create-property/types/create-property-step";
import type { CreatePropertyStepperStep } from "@/features/create-property/types/create-property-step";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertySteps() {
  const currentStep = useCreatePropertyDraftStore((state) => state.currentStep);
  const goNextStep = useCreatePropertyDraftStore((state) => state.goNextStep);
  const goBackStep = useCreatePropertyDraftStore((state) => state.goBackStep);
  const setCurrentStep = useCreatePropertyDraftStore((state) => state.setCurrentStep);

  const currentStepIndex = CREATE_PROPERTY_STEPS.indexOf(currentStep);

  function goToStep(step: CreatePropertyStepperStep) {
    const targetIndex = CREATE_PROPERTY_STEPS.indexOf(step);
    const currentIndex = CREATE_PROPERTY_STEPS.indexOf(currentStep);

    if (targetIndex < 0 || targetIndex > currentIndex) {
      return;
    }

    setCurrentStep(step);
  }

  return {
    currentStep,
    currentStepIndex,
    goNext: goNextStep,
    goBack: goBackStep,
    goToStep,
  };
}
