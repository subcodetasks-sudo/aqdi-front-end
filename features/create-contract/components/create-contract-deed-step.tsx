"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractDeceasedOwnerSection from "@/features/create-contract/components/create-contract-deceased-owner-section";
import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractDeedNationalAddress from "@/features/create-contract/components/create-contract-deed-national-address";
import CreateContractDeedTypeSelect from "@/features/create-contract/components/create-contract-deed-type-select";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import { Switch } from "@/components/ui/switch";
import { useCreateContractDeedStep } from "@/features/create-contract/hooks/use-create-contract-deed-step";
import { useSubmitContractStep1 } from "@/features/create-contract/hooks/use-submit-contract-step1";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import { useSubmitContractStep2 } from "@/features/create-contract/hooks/use-submit-contract-step2";
import { type DeedTypeId } from "@/features/create-contract/types/deed-type";
import {
  deedTypeIsLeaseRenewal,
  deedTypeIsSublease,
} from "@/features/create-contract/types/deed-type";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { mapDeedTypeToInstrumentType } from "@/features/create-contract/utils/map-deed-type-to-instrument-type";
import CreateContractSubleaseSection from "@/features/create-contract/components/create-contract-sublease-section";
import DeedInstrumentEntrySection from "@/features/shared/components/deed-instrument-entry-section";
import InstrumentTypePopupDialog from "@/features/shared/components/instrument-type-popup-dialog";
import { useInstrumentTypeDeedPopup } from "@/features/shared/hooks/use-instrument-type-deed-popup";
import { isManualDeedEntryComplete } from "@/features/shared/types/manual-deed-entry";
import { deedTypeSupportsManualEntry } from "@/features/shared/utils/supports-manual-deed-entry";

type CreateContractDeedStepProps = {
  labels: CreateContractLabels["deed"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractDeedStep({
  labels,
  onBack,
  onComplete,
}: CreateContractDeedStepProps) {
  const tIncomplete = useTranslations("createContract");
  const {
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
    hasMinorHeirs,
    setHasMinorHeirs,
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
    showNationalAddress,
    canContinue,
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
    useManualDeedEntry,
    setUseManualDeedEntry,
    manualDeedEntry,
    setManualDeedEntry,
  } = useCreateContractDeedStep();
  const isSublease = deedTypeIsSublease(selectedDeedType);
  const setCurrentStep = useCreateContractDraftStore((state) => state.setCurrentStep);
  const { submitStep1, isSubmitting: isSubmittingStep1 } = useSubmitContractStep1();
  const { submitStep2, isSubmitting: isSubmittingStep2 } = useSubmitContractStep2();
  const isSubmitting = isSubmittingStep1 || isSubmittingStep2;
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const deedTypePopup = useInstrumentTypeDeedPopup("contract");
  const supportsManualEntry = deedTypeSupportsManualEntry(selectedDeedType);

  const deedPhase = labels.phases[0];
  const addressPhase = labels.phases[1];

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

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(tIncomplete("incompleteContinue"));
      return;
    }

    if (selectedDeedType && deedTypeIsLeaseRenewal(selectedDeedType)) {
      const submitted = await submitStep1(selectedDeedType, {});

      if (!submitted) {
        return;
      }

      setCurrentStep("tenant");
      return;
    }

    const hasManualEntry =
      useManualDeedEntry &&
      supportsManualEntry &&
      isManualDeedEntryComplete(manualDeedEntry);

    const hasNewFile = needsFrontBack
      ? deedFrontFiles.length > 0 || deedBackFiles.length > 0
      : isDeceasedOwner
        ? deedFiles.length > 0 ||
          deedInheritanceFiles.length > 0 ||
          deedHeirsPoaFiles.length > 0 ||
          deedGuardiansPoaFiles.length > 0
        : isWaqfOwner
          ? deedFiles.length > 0 ||
            deedEndowmentCertFiles.length > 0 ||
            deedTrusteeshipFiles.length > 0 ||
            deedGuardiansPoaFiles.length > 0
          : deedFiles.length > 0;

    const shouldSubmitDeed = hasManualEntry || hasNewFile;

    if (selectedDeedType && shouldSubmitDeed) {
      const submitted = await submitStep1(
        selectedDeedType,
        hasManualEntry
          ? isDeceasedOwner
            ? {
                manualDeedEntry,
                inheritance: deedInheritanceFiles[0],
                heirsPoa: deedHeirsPoaFiles[0],
              }
            : isWaqfOwner
              ? {
                  manualDeedEntry,
                  endowmentCert: deedEndowmentCertFiles[0],
                  trusteeship: deedTrusteeshipFiles[0],
                  isMultipleTrusteeshipDeedCopy,
                  guardiansPoa: isMultipleTrusteeshipDeedCopy
                    ? deedGuardiansPoaFiles[0]
                    : undefined,
                }
              : { manualDeedEntry }
          : needsFrontBack
            ? { front: deedFrontFiles[0], back: deedBackFiles[0] }
            : isDeceasedOwner
              ? {
                  instrument: deedFiles[0],
                  inheritance: deedInheritanceFiles[0],
                  heirsPoa: deedHeirsPoaFiles[0],
                  guardiansPoa: hasMinorHeirs
                    ? deedGuardiansPoaFiles[0]
                    : undefined,
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

    if (!nationalAddressMethod) {
      toast.error(tIncomplete("incompleteContinue"));
      return;
    }

    const submittedAddress = await submitStep2({
      addressMethod: nationalAddressMethod,
      photoFiles: nationalAddressPhotoFiles,
      linkUrl: nationalAddressLinkUrl,
      manualAddress: nationalAddressManual,
    });

    if (!submittedAddress) {
      return;
    }

    onComplete();
  }

  const showDeedFields =
    Boolean(selectedDeedType || existingInstrumentImageUrl) && !isLeaseRenewal;
  const hasExistingInstrument =
    Boolean(existingInstrumentImageUrl) ||
    Boolean(existingInstrumentFrontImageUrl) ||
    Boolean(existingInstrumentBackImageUrl);
  const allowManualEntry =
    supportsManualEntry && !isInstrumentTypeLocked && !(isDeedAlreadySubmitted && hasExistingInstrument);

  function renderInstrumentUpload(upload: ReactNode) {
    if (!showDeedFields) {
      return null;
    }

    if (!allowManualEntry) {
      return upload;
    }

    return (
      <DeedInstrumentEntrySection
        labels={labels.manualEntry}
        useManualDeedEntry={useManualDeedEntry}
        onUseManualDeedEntryChange={setUseManualDeedEntry}
        manualDeedEntry={manualDeedEntry}
        onManualDeedEntryChange={setManualDeedEntry}
        FormSelect={CreateContractFormSelect}
        FieldLabel={CreateContractFieldLabel}
        upload={upload}
      />
    );
  }

  function renderDeedInstrumentContent() {
    if (!showDeedFields) {
      return null;
    }

    if (isSublease) {
      return (
        <CreateContractSubleaseSection
          labels={labels.sublease}
          deedImageLabels={labels.deedImage}
          value={deedFiles}
          onChange={setDeedFiles}
          existingImageUrl={existingInstrumentImageUrl}
          showFieldErrors={showFieldErrors}
        />
      );
    }

    if (needsFrontBack) {
      return (
        <div className="space-y-6">
          {renderInstrumentUpload(
            <div className="space-y-6">
              <CreateContractDeedImageUpload
                labels={labels.deedImage}
                fieldLabel={labels.deedImage.frontLabel}
                single
                variant="dropzone"
                value={deedFrontFiles}
                onChange={setDeedFrontFiles}
                existingImageUrl={existingInstrumentFrontImageUrl}
              />

              <CreateContractDeedImageUpload
                labels={labels.deedImage}
                fieldLabel={labels.deedImage.backLabel}
                single
                variant="dropzone"
                value={deedBackFiles}
                onChange={setDeedBackFiles}
                existingImageUrl={existingInstrumentBackImageUrl}
              />
            </div>,
          )}
        </div>
      );
    }

    if (isDeceasedOwner) {
      return (
        <CreateContractDeceasedOwnerSection
          labels={labels.deceased}
          deedImageLabels={labels.deedImage}
          deedFiles={deedFiles}
          onDeedFilesChange={setDeedFiles}
          existingDeedImageUrl={existingInstrumentImageUrl}
          inheritanceFiles={deedInheritanceFiles}
          onInheritanceFilesChange={setDeedInheritanceFiles}
          existingInheritanceImageUrl={existingInheritanceImageUrl}
          heirsPoaFiles={deedHeirsPoaFiles}
          onHeirsPoaFilesChange={setDeedHeirsPoaFiles}
          existingHeirsPoaImageUrl={existingHeirsPoaImageUrl}
          hasMinorHeirs={hasMinorHeirs}
          onHasMinorHeirsChange={setHasMinorHeirs}
          guardiansPoaFiles={deedGuardiansPoaFiles}
          onGuardiansPoaFilesChange={setDeedGuardiansPoaFiles}
          existingGuardiansPoaImageUrl={existingGuardiansPoaImageUrl}
          showFieldErrors={showFieldErrors}
        />
      );
    }

    if (isWaqfOwner) {
      return (
        <div className="space-y-6">
          {renderInstrumentUpload(
            <CreateContractDeedImageUpload
              labels={labels.deedImage}
              single
              variant="dropzone"
              value={deedFiles}
              onChange={setDeedFiles}
              existingImageUrl={existingInstrumentImageUrl}
            />,
          )}

          <CreateContractDeedImageUpload
            labels={labels.deedImage}
            fieldLabel={labels.deedImage.endowmentCertLabel}
            single
            variant="dropzone"
            value={deedEndowmentCertFiles}
            onChange={setDeedEndowmentCertFiles}
            existingImageUrl={existingEndowmentCertImageUrl}
          />

          <CreateContractDeedImageUpload
            labels={labels.deedImage}
            fieldLabel={labels.deedImage.trusteeshipLabel}
            single
            variant="dropzone"
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
              className="h-6 w-11 shrink-0 data-checked:bg-brand data-unchecked:bg-[#d9d9d9]"
            />
          </label>

          {isMultipleTrusteeshipDeedCopy ? (
            <CreateContractDeedImageUpload
              labels={labels.deedImage}
              fieldLabel={labels.deedImage.guardiansPoaLabel}
              single
              variant="dropzone"
              value={deedGuardiansPoaFiles}
              onChange={setDeedGuardiansPoaFiles}
              existingImageUrl={existingGuardiansPoaImageUrl}
            />
          ) : null}
        </div>
      );
    }

    return renderInstrumentUpload(
      <CreateContractDeedImageUpload
        labels={labels.deedImage}
        variant="dropzone"
        value={deedFiles}
        onChange={setDeedFiles}
        existingImageUrl={existingInstrumentImageUrl}
      />,
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] bg-white p-5 shadow-sm md:p-8">
        <CreateContractStepPhaseHeader
          title={deedPhase.title}
          subtitle={deedPhase.subtitle}
          showIcon={false}
        />

        <div className="space-y-8">
          <div className="space-y-5 rounded-[24px] bg-white p-4 md:p-5">
            <CreateContractDeedTypeSelect
              labels={labels.deedType}
              value={selectedDeedType}
              onChange={handleDeedTypeChange}
              locked={isInstrumentTypeLocked}
              invalid={showFieldErrors && selectedDeedType === ""}
            />

            {renderDeedInstrumentContent()}
          </div>

          {showNationalAddress ? (
            <div className="space-y-6 border-t border-dashed border-[#d9d9d9] pt-8">
              <CreateContractStepPhaseHeader
                title={addressPhase.title}
                subtitle={addressPhase.subtitle}
                showIcon={false}
              />

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
                showFieldErrors={showFieldErrors}
              />
            </div>
          ) : null}
        </div>
      </div>

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        isSubmitting={isSubmitting}
        variant="stacked"
        onPrevious={onBack}
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
