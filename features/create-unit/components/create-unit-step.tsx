"use client";

import CreateUnitDataForm from "@/features/create-unit/components/create-unit-data-form";
import CreateUnitStepNavigation from "@/features/create-unit/components/create-unit-step-navigation";
import CreateUnitStepPhaseHeader from "@/features/create-unit/components/create-unit-step-phase-header";
import { useCreateUnitStep } from "@/features/create-unit/hooks/use-create-unit-step";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";

type CreateUnitStepProps = {
  labels: CreateUnitLabels;
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateUnitStep({
  labels,
  onBack,
  onComplete,
}: CreateUnitStepProps) {
  const { unitData, setUnitData, canContinue } = useCreateUnitStep();

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    // TODO: integrate with unit creation API
    onComplete();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateUnitStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
        />

        <CreateUnitDataForm
          labels={labels}
          value={unitData}
          onChange={setUnitData}
        />
      </div>

      <CreateUnitStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={labels.navigation.continue}
        canContinue={canContinue}
        onPrevious={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
