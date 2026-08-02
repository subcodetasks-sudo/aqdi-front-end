"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreatePropertyAgentDataPhase from "@/features/create-property/components/create-property-agent-data-phase";
import CreatePropertyOwnerDataPhase from "@/features/create-property/components/create-property-owner-data-phase";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
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
    ownerData,
    setOwnerData,
    agentData,
    setAgentData,
    canContinue,
    hasExistingPowerOfAttorney,
  } = useCreatePropertyOwnerStep();
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const phase = labels.phases[0];
  const showAgentForm = ownerData.hasAgent === "yes";

  function handleContinue() {
    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(t("incompleteContinue"));
      return;
    }

    setShowFieldErrors(false);
    onComplete();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-b-3xl bg-white p-3 md:p-5 dark:bg-[#1a2421]">
        <CreatePropertyStepPhaseHeader
          title={phase.title}
          subtitle={phase.subtitle}
        />

        <div className="space-y-3">
          <CreatePropertyOwnerDataPhase
            labels={labels.ownerData}
            birthDateLabels={labels.birthDate}
            validationLabels={labels.validation.fieldErrors}
            value={ownerData}
            onChange={setOwnerData}
            showFieldErrors={showFieldErrors}
          />

          {showAgentForm ? (
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
          onPrevious={onBack}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}
