"use client";

import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractDeedNationalAddress from "@/features/create-contract/components/create-contract-deed-national-address";
import CreateContractDeedTypeSelect from "@/features/create-contract/components/create-contract-deed-type-select";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractStepPhaseProgress from "@/features/create-contract/components/create-contract-step-phase-progress";
import { useCreateContractDeedStep } from "@/features/create-contract/hooks/use-create-contract-deed-step";
import { useSubmitContractStep1 } from "@/features/create-contract/hooks/use-submit-contract-step1";
import { useSubmitContractStep2 } from "@/features/create-contract/hooks/use-submit-contract-step2";
import { DEED_STEP_PHASE_COUNT } from "@/features/create-contract/types/deed-type";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractDeedStepProps = {
  labels: CreateContractLabels["deed"];
  onBack: () => void;
  onComplete: () => void;
};

const PHASE_ICONS = ["check", "location"] as const;

export default function CreateContractDeedStep({
  labels,
  onBack,
  onComplete,
}: CreateContractDeedStepProps) {
  const {
    currentPhaseIndex,
    selectedDeedType,
    setSelectedDeedType,
    deedFiles,
    setDeedFiles,
    nationalAddressMethod,
    setNationalAddressMethod,
    nationalAddressPhotoFiles,
    setNationalAddressPhotoFiles,
    nationalAddressLinkUrl,
    setNationalAddressLinkUrl,
    mapLocation,
    setMapLocation,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
    existingInstrumentImageUrl,
    existingAddressImageUrl,
    isInstrumentTypeLocked,
    isDeedAlreadySubmitted,
  } = useCreateContractDeedStep();
  const { submitStep1, isSubmitting: isSubmittingStep1 } = useSubmitContractStep1();
  const { submitStep2, isSubmitting: isSubmittingStep2 } = useSubmitContractStep2();
  const isSubmitting = isSubmittingStep1 || isSubmittingStep2;

  const phase = labels.phases[currentPhaseIndex];

  function handlePrevious() {
    if (currentPhaseIndex === 0) {
      onBack();
      return;
    }

    goToPreviousPhase();
  }

  async function handleContinue() {
    if (!canContinue || isSubmitting) {
      return;
    }

    if (currentPhaseIndex === 0) {
      if (selectedDeedType && deedFiles.length > 0) {
        const submitted = await submitStep1(selectedDeedType, deedFiles);

        if (!submitted) {
          return;
        }
      } else if (!isInstrumentTypeLocked && !isDeedAlreadySubmitted) {
        return;
      }
      // Locked existing-property contracts (from /contract/start) and resumed
      // contracts already carry the deed data, so continue without resubmitting
      // when no new file was chosen.
    }

    if (isLastPhase) {
      const submitted = await submitStep2({
        addressMethod: nationalAddressMethod,
        photoFiles: nationalAddressPhotoFiles,
        linkUrl: nationalAddressLinkUrl,
      });

      if (!submitted) {
        return;
      }

      onComplete();
      return;
    }

    goToNextPhase();
  }

  return (
    <div className="space-y-4">
      <CreateContractStepPhaseProgress
        totalPhases={DEED_STEP_PHASE_COUNT}
        currentPhaseIndex={currentPhaseIndex}
      />

      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateContractStepPhaseHeader
          title={phase.title}
          subtitle={phase.subtitle}
          icon={PHASE_ICONS[currentPhaseIndex]}
        />

        {currentPhaseIndex === 0 ? (
          <div className="space-y-6">
            <CreateContractDeedTypeSelect
              labels={labels.deedType}
              value={selectedDeedType}
              onChange={setSelectedDeedType}
              locked={isInstrumentTypeLocked}
            />

            {selectedDeedType || existingInstrumentImageUrl ? (
              <CreateContractDeedImageUpload
                labels={labels.deedImage}
                value={deedFiles}
                onChange={setDeedFiles}
                existingImageUrl={existingInstrumentImageUrl}
              />
            ) : null}
          </div>
        ) : null}

        {currentPhaseIndex === 1 ? (
          <CreateContractDeedNationalAddress
            labels={labels.nationalAddress}
            method={nationalAddressMethod}
            onMethodChange={setNationalAddressMethod}
            photoFiles={nationalAddressPhotoFiles}
            onPhotoFilesChange={setNationalAddressPhotoFiles}
            linkUrl={nationalAddressLinkUrl}
            onLinkUrlChange={setNationalAddressLinkUrl}
            mapLocation={mapLocation}
            onMapLocationChange={setMapLocation}
            existingPhotoUrl={existingAddressImageUrl}
          />
        ) : null}
      </div>

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        canContinue={canContinue && !isSubmitting}
        onPrevious={handlePrevious}
        onContinue={() => void handleContinue()}
      />
    </div>
  );
}
