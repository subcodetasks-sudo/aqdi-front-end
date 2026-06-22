"use client";

import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractDeedNationalAddress from "@/features/create-contract/components/create-contract-deed-national-address";
import CreateContractDeedTypeSelect from "@/features/create-contract/components/create-contract-deed-type-select";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractStepPhaseProgress from "@/features/create-contract/components/create-contract-step-phase-progress";
import { useCreateContractDeedStep } from "@/features/create-contract/hooks/use-create-contract-deed-step";
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
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
  } = useCreateContractDeedStep();

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
      return;
    }

    if (isLastPhase) {
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
            />

            {selectedDeedType ? (
              <CreateContractDeedImageUpload
                labels={labels.deedImage}
                value={deedFiles}
                onChange={setDeedFiles}
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
          />
        ) : null}
      </div>

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={labels.navigation.continue}
        canContinue={canContinue}
        onPrevious={handlePrevious}
        onContinue={handleContinue}
      />
    </div>
  );
}
