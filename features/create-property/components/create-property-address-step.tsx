"use client";

import CreatePropertyNationalAddress from "@/features/create-property/components/create-property-national-address";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import { useCreatePropertyAddressStep } from "@/features/create-property/hooks/use-create-property-address-step";
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
  const {
    method,
    setMethod,
    photoFiles,
    setPhotoFiles,
    linkUrl,
    setLinkUrl,
    mapLocation,
    canContinue,
  } = useCreatePropertyAddressStep();

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
