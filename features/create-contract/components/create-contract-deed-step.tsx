"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractDeedNationalAddress from "@/features/create-contract/components/create-contract-deed-national-address";
import CreateContractDeedTypeSelect from "@/features/create-contract/components/create-contract-deed-type-select";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractStepPhaseProgress from "@/features/create-contract/components/create-contract-step-phase-progress";
import { Switch } from "@/components/ui/switch";
import { useCreateContractDeedStep } from "@/features/create-contract/hooks/use-create-contract-deed-step";
import { useSubmitContractStep1 } from "@/features/create-contract/hooks/use-submit-contract-step1";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import { useSubmitContractStep2 } from "@/features/create-contract/hooks/use-submit-contract-step2";
import { DEED_STEP_PHASE_COUNT, type DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsLeaseRenewal } from "@/features/create-contract/types/deed-type";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { mapDeedTypeToInstrumentType } from "@/features/create-contract/utils/map-deed-type-to-instrument-type";
import InstrumentTypePopupDialog from "@/features/shared/components/instrument-type-popup-dialog";
import { useInstrumentTypeDeedPopup } from "@/features/shared/hooks/use-instrument-type-deed-popup";

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
  const tIncomplete = useTranslations("createContract");
  const {
    currentPhaseIndex,
    selectedDeedType,
    setSelectedDeedType,
    deedFiles,
    setDeedFiles,
    deedFrontFiles,
    setDeedFrontFiles,
    deedBackFiles,
    setDeedBackFiles,
    deedInheritanceFiles,
    setDeedInheritanceFiles,
    deedHeirsPoaFiles,
    setDeedHeirsPoaFiles,
    deedEndowmentCertFiles,
    setDeedEndowmentCertFiles,
    deedTrusteeshipFiles,
    setDeedTrusteeshipFiles,
    isMultipleTrusteeshipDeedCopy,
    setIsMultipleTrusteeshipDeedCopy,
    deedGuardiansPoaFiles,
    setDeedGuardiansPoaFiles,
    needsFrontBack,
    isDeceasedOwner,
    isWaqfOwner,
    nationalAddressMethod,
    setNationalAddressMethod,
    nationalAddressPhotoFiles,
    setNationalAddressPhotoFiles,
    nationalAddressLinkUrl,
    setNationalAddressLinkUrl,
    nationalAddressManual,
    setNationalAddressManual,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
    existingInstrumentImageUrl,
    existingInstrumentFrontImageUrl,
    existingInstrumentBackImageUrl,
    existingInheritanceImageUrl,
    existingHeirsPoaImageUrl,
    existingEndowmentCertImageUrl,
    existingTrusteeshipImageUrl,
    existingGuardiansPoaImageUrl,
    existingAddressImageUrl,
    isInstrumentTypeLocked,
    isDeedAlreadySubmitted,
    isLeaseRenewal,
  } = useCreateContractDeedStep();
  const setCurrentStep = useCreateContractDraftStore((state) => state.setCurrentStep);
  const { submitStep1, isSubmitting: isSubmittingStep1 } = useSubmitContractStep1();
  const { submitStep2, isSubmitting: isSubmittingStep2 } = useSubmitContractStep2();
  const isSubmitting = isSubmittingStep1 || isSubmittingStep2;
  const deedTypePopup = useInstrumentTypeDeedPopup("contract");

  const phase = labels.phases[currentPhaseIndex];

  function handleDeedTypeChange(value: DeedTypeId | "") {
    setSelectedDeedType(value);

    if (!value || isInstrumentTypeLocked) {
      return;
    }

    void deedTypePopup.showPopupFor(
      mapDeedTypeToInstrumentType(value),
      labels.deedType.types[value],
    );
  }

  function handlePrevious() {
    if (currentPhaseIndex === 0) {
      onBack();
      return;
    }

    goToPreviousPhase();
  }

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinue) {
      toast.error(tIncomplete("incompleteContinue"));
      return;
    }

    if (currentPhaseIndex === 0) {
      if (selectedDeedType && deedTypeIsLeaseRenewal(selectedDeedType)) {
        const submitted = await submitStep1(selectedDeedType, {});

        if (!submitted) {
          return;
        }

        setCurrentStep("tenant");
        return;
      }

      const hasNewFile = needsFrontBack
        ? deedFrontFiles.length > 0 || deedBackFiles.length > 0
        : isDeceasedOwner
          ? deedFiles.length > 0 ||
            deedInheritanceFiles.length > 0 ||
            deedHeirsPoaFiles.length > 0
          : isWaqfOwner
            ? deedFiles.length > 0 ||
              deedEndowmentCertFiles.length > 0 ||
              deedTrusteeshipFiles.length > 0 ||
              deedGuardiansPoaFiles.length > 0
            : deedFiles.length > 0;

      if (selectedDeedType && hasNewFile) {
        const submitted = await submitStep1(
          selectedDeedType,
          needsFrontBack
            ? { front: deedFrontFiles[0], back: deedBackFiles[0] }
            : isDeceasedOwner
              ? {
                  instrument: deedFiles[0],
                  inheritance: deedInheritanceFiles[0],
                  heirsPoa: deedHeirsPoaFiles[0],
                }
              : isWaqfOwner
                ? {
                    instrument: deedFiles[0],
                    endowmentCert: deedEndowmentCertFiles[0],
                    trusteeship: deedTrusteeshipFiles[0],
                    isMultipleTrusteeshipDeedCopy,
                    guardiansPoa: isMultipleTrusteeshipDeedCopy
                      ? deedGuardiansPoaFiles[0]
                      : undefined,
                  }
                : { instrument: deedFiles[0] },
        );

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
      if (!nationalAddressMethod) {
        toast.error(tIncomplete("incompleteContinue"));
        return;
      }

      const submitted = await submitStep2({
        addressMethod: nationalAddressMethod,
        photoFiles: nationalAddressPhotoFiles,
        linkUrl: nationalAddressLinkUrl,
        manualAddress: nationalAddressManual,
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
              onChange={handleDeedTypeChange}
              locked={isInstrumentTypeLocked}
            />

            {(selectedDeedType || existingInstrumentImageUrl) &&
            !isLeaseRenewal &&
            needsFrontBack ? (
              <div className="space-y-6">
                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.frontLabel}
                  single
                  value={deedFrontFiles}
                  onChange={setDeedFrontFiles}
                  existingImageUrl={existingInstrumentFrontImageUrl}
                />

                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.backLabel}
                  single
                  value={deedBackFiles}
                  onChange={setDeedBackFiles}
                  existingImageUrl={existingInstrumentBackImageUrl}
                />
              </div>
            ) : (selectedDeedType || existingInstrumentImageUrl) &&
              !isLeaseRenewal &&
              isDeceasedOwner ? (
              <div className="space-y-6">
                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  single
                  value={deedFiles}
                  onChange={setDeedFiles}
                  existingImageUrl={existingInstrumentImageUrl}
                />

                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.inheritanceLabel}
                  single
                  value={deedInheritanceFiles}
                  onChange={setDeedInheritanceFiles}
                  existingImageUrl={existingInheritanceImageUrl}
                />

                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.heirsPoaLabel}
                  single
                  value={deedHeirsPoaFiles}
                  onChange={setDeedHeirsPoaFiles}
                  existingImageUrl={existingHeirsPoaImageUrl}
                />
              </div>
            ) : (selectedDeedType || existingInstrumentImageUrl) &&
              !isLeaseRenewal &&
              isWaqfOwner ? (
              <div className="space-y-6">
                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  single
                  value={deedFiles}
                  onChange={setDeedFiles}
                  existingImageUrl={existingInstrumentImageUrl}
                />

                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.endowmentCertLabel}
                  single
                  value={deedEndowmentCertFiles}
                  onChange={setDeedEndowmentCertFiles}
                  existingImageUrl={existingEndowmentCertImageUrl}
                />

                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.trusteeshipLabel}
                  single
                  value={deedTrusteeshipFiles}
                  onChange={setDeedTrusteeshipFiles}
                  existingImageUrl={existingTrusteeshipImageUrl}
                />

                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-brand">
                    {labels.waqf.multipleTrusteesLabel}
                  </span>
                  <Switch
                    dir="ltr"
                    checked={isMultipleTrusteeshipDeedCopy}
                    onCheckedChange={setIsMultipleTrusteeshipDeedCopy}
                    className="h-6 w-11 shrink-0 data-checked:bg-brand-secondary data-unchecked:bg-[#d9d9d9]"
                  />
                </label>

                {isMultipleTrusteeshipDeedCopy ? (
                  <CreateContractDeedImageUpload
                    labels={labels.deedImage}
                    fieldLabel={labels.deedImage.guardiansPoaLabel}
                    single
                    value={deedGuardiansPoaFiles}
                    onChange={setDeedGuardiansPoaFiles}
                    existingImageUrl={existingGuardiansPoaImageUrl}
                  />
                ) : null}
              </div>
            ) : (selectedDeedType || existingInstrumentImageUrl) && !isLeaseRenewal ? (
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
            manualAddress={nationalAddressManual}
            onManualAddressChange={setNationalAddressManual}
            existingPhotoUrl={existingAddressImageUrl}
          />
        ) : null}
      </div>

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
        onContinue={() => void handleContinue()}
      />

      <InstrumentTypePopupDialog
        open={deedTypePopup.open}
        onOpenChange={deedTypePopup.setOpen}
        popup={deedTypePopup.popup}
        deedTypeLabel={deedTypePopup.deedTypeLabel}
      />
    </div>
  );
}
