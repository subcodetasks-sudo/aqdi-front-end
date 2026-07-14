"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreatePropertyNationalAddress from "@/features/create-property/components/create-property-national-address";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import { useCreatePropertyAddressStep } from "@/features/create-property/hooks/use-create-property-address-step";
import { useSubmitPropertyStep1 } from "@/features/create-property/hooks/use-submit-property-step1";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

type CreatePropertyAddressStepProps = {
  labels: CreatePropertyLabels["address"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreatePropertyAddressStep({
  labels,
  onBack,
  onComplete,
}: CreatePropertyAddressStepProps) {
  const tIncomplete = useTranslations("createProperty");
  const {
    method,
    setMethod,
    photoFiles,
    setPhotoFiles,
    linkUrl,
    setLinkUrl,
    manualAddress,
    setManualAddress,
    existingAddressImageUrl,
    canContinue,
  } = useCreatePropertyAddressStep();
  const { isSubmitting, submitStep1 } = useSubmitPropertyStep1();

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinue) {
      toast.error(tIncomplete("incompleteContinue"));
      return;
    }

    const result = await submitStep1();

    if (!result.ok) {
      toast.error(result.error || labels.navigation.submitError);
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
          icon="location"
        />

        <CreatePropertyNationalAddress
          labels={labels.nationalAddress}
          method={method}
          onMethodChange={setMethod}
          photoFiles={photoFiles}
          onPhotoFilesChange={setPhotoFiles}
          existingPhotoUrl={existingAddressImageUrl}
          linkUrl={linkUrl}
          onLinkUrlChange={setLinkUrl}
          manualAddress={manualAddress}
          onManualAddressChange={setManualAddress}
        />
      </div>

      <CreatePropertyStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        isSubmitting={isSubmitting}
        onPrevious={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
