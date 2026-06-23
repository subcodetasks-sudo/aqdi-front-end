"use client";

import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";
import CreatePropertyDeedTypeSelect from "@/features/create-property/components/create-property-deed-type-select";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import { useCreatePropertyDeedStep } from "@/features/create-property/hooks/use-create-property-deed-step";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

type CreatePropertyDeedStepProps = {
  labels: CreatePropertyLabels["deed"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreatePropertyDeedStep({
  labels,
  onBack,
  onComplete,
}: CreatePropertyDeedStepProps) {
  const {
    selectedDeedType,
    setSelectedDeedType,
    deedFiles,
    setDeedFiles,
    canContinue,
  } = useCreatePropertyDeedStep();

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    onComplete();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreatePropertyStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
        />

        <div className="space-y-6">
          <CreatePropertyDeedTypeSelect
            labels={labels.deedType}
            value={selectedDeedType}
            onChange={setSelectedDeedType}
          />

          {selectedDeedType ? (
            <CreatePropertyDeedImageUpload
              labels={labels.deedImage}
              value={deedFiles}
              onChange={setDeedFiles}
            />
          ) : null}
        </div>
      </div>

      <CreatePropertyStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={labels.navigation.continue}
        canContinue={canContinue}
        onPrevious={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
