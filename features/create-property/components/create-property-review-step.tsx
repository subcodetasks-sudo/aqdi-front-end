"use client";

import CreatePropertyNameField from "@/features/create-property/components/create-property-name-field";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import { useCreatePropertyReviewStep } from "@/features/create-property/hooks/use-create-property-review-step";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

type CreatePropertyReviewStepProps = {
  labels: CreatePropertyLabels["review"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreatePropertyReviewStep({
  labels,
  onBack,
  onComplete,
}: CreatePropertyReviewStepProps) {
  const { reviewData, setReviewData, canContinue } =
    useCreatePropertyReviewStep();

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
          icon="tag"
        />

        <CreatePropertyNameField
          label={labels.propertyName.label}
          placeholder={labels.propertyName.placeholder}
          hint={labels.propertyName.hint}
          example={labels.propertyName.example}
          value={reviewData.propertyName}
          onChange={(propertyName) =>
            setReviewData({ ...reviewData, propertyName })
          }
        />
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
