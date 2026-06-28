"use client";

import {
  CREATE_PROPERTY_STEPS,
} from "@/features/create-property/types/create-property-step";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertySteps() {
  const currentStep = useCreatePropertyDraftStore((state) => state.currentStep);
  const goNextStep = useCreatePropertyDraftStore((state) => state.goNextStep);
  const goBackStep = useCreatePropertyDraftStore((state) => state.goBackStep);

  const currentStepIndex = CREATE_PROPERTY_STEPS.indexOf(currentStep);

  return {
    currentStep,
    currentStepIndex,
    goNext: goNextStep,
    goBack: goBackStep,
  };
}
