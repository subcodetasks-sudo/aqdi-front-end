"use client";

import { toast } from "sonner";

import CreatePropertyNationalAddress from "@/features/create-property/components/create-property-national-address";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import { useCreatePropertyAddressStep } from "@/features/create-property/hooks/use-create-property-address-step";
import { useSubmitPropertyStep1 } from "@/features/create-property/hooks/use-submit-property-step1";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyTypeId } from "@/features/properties/types/property-type";

type CreatePropertyAddressStepProps = {
  labels: CreatePropertyLabels["address"];
  propertyType: PropertyTypeId;
  onBack: () => void;
  onComplete: () => void;
};

export default function CreatePropertyAddressStep({
  labels,
  propertyType,
  onBack,
  onComplete,
}: CreatePropertyAddressStepProps) {
  const {
    method,
    setMethod,
    photoFiles,
    setPhotoFiles,
    linkUrl,
    setLinkUrl,
    mapLocation,
    setMapLocation,
    canContinue,
  } = useCreatePropertyAddressStep();
  const { isSubmitting, submitStep1 } = useSubmitPropertyStep1(propertyType);

  async function handleContinue() {
    if (!canContinue || isSubmitting) {
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
          linkUrl={linkUrl}
          onLinkUrlChange={setLinkUrl}
          mapLocation={mapLocation}
          onMapLocationChange={setMapLocation}
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
