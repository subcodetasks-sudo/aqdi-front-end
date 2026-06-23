"use client";

import { useState } from "react";

import {
  CREATE_PROPERTY_STEPS,
  type CreatePropertyStep,
} from "@/features/create-property/types/create-property-step";

export function useCreatePropertySteps() {
  const [currentStep, setCurrentStep] =
    useState<CreatePropertyStep>("deed");

  const currentStepIndex = CREATE_PROPERTY_STEPS.indexOf(currentStep);

  function goNext() {
    const nextIndex = currentStepIndex + 1;

    if (nextIndex < CREATE_PROPERTY_STEPS.length) {
      setCurrentStep(CREATE_PROPERTY_STEPS[nextIndex]);
    }
  }

  function goBack() {
    const previousIndex = currentStepIndex - 1;

    if (previousIndex >= 0) {
      setCurrentStep(CREATE_PROPERTY_STEPS[previousIndex]);
    }
  }

  return {
    currentStep,
    currentStepIndex,
    goNext,
    goBack,
  };
}
