"use client";

import { useState } from "react";

import type { CreateUnitStep } from "@/features/create-unit/types/create-unit-step";

export function useCreateUnitSteps() {
  const [currentStep, setCurrentStep] = useState<CreateUnitStep>("form");

  function goNext() {
    setCurrentStep((step) => (step === "form" ? "success" : step));
  }

  function goBack() {
    setCurrentStep((step) => (step === "success" ? "form" : step));
  }

  return {
    currentStep,
    goNext,
    goBack,
  };
}
