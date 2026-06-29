"use client";

import { toast } from "sonner";

import CreatePropertyNameField from "@/features/create-property/components/create-property-name-field";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import { useCreatePropertyReviewStep } from "@/features/create-property/hooks/use-create-property-review-step";
import { useSubmitPropertyStep2 } from "@/features/create-property/hooks/use-submit-property-step2";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

type CreatePropertyReviewStepProps = {
  labels: CreatePropertyLabels["review"];
  onBack: () => void;
  onComplete: (propertyId: number) => void;
};

export default function CreatePropertyReviewStep({
  labels,
  onBack,
  onComplete,
}: CreatePropertyReviewStepProps) {
  const { reviewData, setReviewData, canContinue } =
    useCreatePropertyReviewStep();
  const { isSubmitting, submitStep2 } = useSubmitPropertyStep2();

  async function handleContinue() {
    if (!canContinue || isSubmitting) {
      return;
    }

    const result = await submitStep2();

    if (!result.ok) {
      toast.error(result.error || labels.navigation.submitError);
      return;
    }

    onComplete(result.propertyId);
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
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        canContinue={canContinue}
        isSubmitting={isSubmitting}
        onPrevious={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
