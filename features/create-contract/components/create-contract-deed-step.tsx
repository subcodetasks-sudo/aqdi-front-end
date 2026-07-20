"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

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
import { deedTypeIsLeaseRenewal } from "@/features/create-contract/types/deed-type";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { mapDeedTypeToInstrumentType } from "@/features/create-contract/utils/map-deed-type-to-instrument-type";
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
  const setCurrentStep = useCreateContractDraftStore((state) => state.setCurrentStep);
  const { submitStep1, isSubmitting: isSubmittingStep1 } = useSubmitContractStep1();
  const { submitStep2, isSubmitting: isSubmittingStep2 } = useSubmitContractStep2();
  const isSubmitting = isSubmittingStep1 || isSubmittingStep2;
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
          deedHeirsPoaFiles.length > 0
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

  function renderInstrumentEntry(upload: React.ReactNode) {
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

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateContractStepPhaseHeader
          title={deedPhase.title}
          subtitle={deedPhase.subtitle}
          icon="check"
        />

        <div className="space-y-6">
          <CreateContractDeedTypeSelect
            labels={labels.deedType}
            value={selectedDeedType}
            onChange={handleDeedTypeChange}
            locked={isInstrumentTypeLocked}
          />

          {showDeedFields && needsFrontBack ? (
            <div className="space-y-6">
              {renderInstrumentEntry(
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
                </div>,
              )}
            </div>
          ) : showDeedFields && isDeceasedOwner ? (
            <div className="space-y-6">
              {renderInstrumentEntry(
                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  single
                  value={deedFiles}
                  onChange={setDeedFiles}
                  existingImageUrl={existingInstrumentImageUrl}
                />,
              )}

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
          ) : showDeedFields && isWaqfOwner ? (
            <div className="space-y-6">
              {renderInstrumentEntry(
                <CreateContractDeedImageUpload
                  labels={labels.deedImage}
                  single
                  value={deedFiles}
                  onChange={setDeedFiles}
                  existingImageUrl={existingInstrumentImageUrl}
                />,
              )}

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
          ) : showDeedFields ? (
            renderInstrumentEntry(
              <CreateContractDeedImageUpload
                labels={labels.deedImage}
                value={deedFiles}
                onChange={setDeedFiles}
                existingImageUrl={existingInstrumentImageUrl}
              />,
            )
          ) : null}

          {showNationalAddress ? (
            <div className="space-y-6 border-t border-[#ececec] pt-6">
              <CreateContractStepPhaseHeader
                title={addressPhase.title}
                subtitle={addressPhase.subtitle}
                icon="location"
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
