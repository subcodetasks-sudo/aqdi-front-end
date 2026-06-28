"use client";

import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";

export function useCreateUnitSteps() {
  const currentStep = useCreateUnitDraftStore((state) => state.currentStep);
  const goNextStep = useCreateUnitDraftStore((state) => state.goNextStep);
  const goBackStep = useCreateUnitDraftStore((state) => state.goBackStep);

  return {
    currentStep,
    goNext: goNextStep,
    goBack: goBackStep,
  };
}
