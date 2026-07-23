"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreatePropertyAgentDataPhase from "@/features/create-property/components/create-property-agent-data-phase";
import CreatePropertyOwnerDataPhase from "@/features/create-property/components/create-property-owner-data-phase";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import CreatePropertyStepPhaseProgress from "@/features/create-property/components/create-property-step-phase-progress";
import { useCreatePropertyOwnerStep } from "@/features/create-property/hooks/use-create-property-owner-step";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

type CreatePropertyOwnerStepProps = {
  labels: CreatePropertyLabels["owner"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreatePropertyOwnerStep({
  labels,
  onBack,
  onComplete,
}: CreatePropertyOwnerStepProps) {
  const t = useTranslations("createProperty");
  const {
    currentPhaseIndex,
    ownerData,
    setOwnerData,
    agentData,
    setAgentData,
    phaseCount,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
    hasExistingPowerOfAttorney,
  } = useCreatePropertyOwnerStep();
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  useEffect(() => {
    setShowFieldErrors(false);
  }, [currentPhaseIndex]);

  const phase = labels.phases[currentPhaseIndex];

  function handlePrevious() {
    if (currentPhaseIndex === 0) {
      onBack();
      return;
    }

    goToPreviousPhase();
  }

  function handleContinue() {
    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(t("incompleteContinue"));
      return;
    }

    setShowFieldErrors(false);

    if (isLastPhase) {
      onComplete();
      return;
    }

    goToNextPhase();
  }

  return (
    <div className="space-y-4">
      {phaseCount > 1 ? (
        <CreatePropertyStepPhaseProgress
          totalPhases={phaseCount}
          currentPhaseIndex={currentPhaseIndex}
        />
      ) : null}

      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreatePropertyStepPhaseHeader
          title={phase.title}
          subtitle={phase.subtitle}
          icon="id-card"
        />

        {currentPhaseIndex === 0 ? (
          <CreatePropertyOwnerDataPhase
            labels={labels.ownerData}
            birthDateLabels={labels.birthDate}
            validationLabels={labels.validation.fieldErrors}
            value={ownerData}
            onChange={setOwnerData}
            showFieldErrors={showFieldErrors}
          />
        ) : null}

        {currentPhaseIndex === 1 ? (
          <CreatePropertyAgentDataPhase
            labels={labels.agentData}
            birthDateLabels={labels.birthDate}
            validationLabels={labels.validation.fieldErrors}
            value={agentData}
            onChange={setAgentData}
            showFieldErrors={showFieldErrors}
            hasExistingPowerOfAttorney={hasExistingPowerOfAttorney}
          />
        ) : null}
      </div>

      <CreatePropertyStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={labels.navigation.continue}
        variant="stacked"
        onPrevious={handlePrevious}
        onContinue={handleContinue}
      />
    </div>
  );
}
