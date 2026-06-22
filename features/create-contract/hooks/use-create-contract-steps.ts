"use client";

import { useState } from "react";

import {
  CREATE_CONTRACT_STEPS,
  type CreateContractStep,
} from "@/features/create-contract/types/create-contract-step";

export function useCreateContractSteps() {
  const [currentStep, setCurrentStep] =
    useState<CreateContractStep>("intro");

  const currentStepIndex = CREATE_CONTRACT_STEPS.indexOf(currentStep);

  function goNext() {
    const nextIndex = currentStepIndex + 1;

    if (nextIndex < CREATE_CONTRACT_STEPS.length) {
      setCurrentStep(CREATE_CONTRACT_STEPS[nextIndex]);
    }
  }

  function goBack() {
    const previousIndex = currentStepIndex - 1;

    if (previousIndex >= 0) {
      setCurrentStep(CREATE_CONTRACT_STEPS[previousIndex]);
    }
  }

  return {
    currentStep,
    currentStepIndex,
    goNext,
    goBack,
  };
}
