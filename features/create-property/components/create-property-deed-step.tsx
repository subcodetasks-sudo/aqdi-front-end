"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";
import CreatePropertyDeedTypeSelect from "@/features/create-property/components/create-property-deed-type-select";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import CreatePropertyFormSelect from "@/features/create-property/components/create-property-form-select";
import CreatePropertyNationalAddress from "@/features/create-property/components/create-property-national-address";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import { Switch } from "@/components/ui/switch";
import { useCreatePropertyAddressStep } from "@/features/create-property/hooks/use-create-property-address-step";
import { useCreatePropertyDeedStep } from "@/features/create-property/hooks/use-create-property-deed-step";
import { useSubmitPropertyStep1 } from "@/features/create-property/hooks/use-submit-property-step1";
import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import DeedInstrumentEntrySection from "@/features/shared/components/deed-instrument-entry-section";
import InstrumentTypePopupDialog from "@/features/shared/components/instrument-type-popup-dialog";
import { useInstrumentTypeDeedPopup } from "@/features/shared/hooks/use-instrument-type-deed-popup";
import { propertyDeedTypeSupportsManualEntry } from "@/features/shared/utils/supports-manual-deed-entry";

type CreatePropertyDeedStepProps = {
  labels: CreatePropertyLabels["deed"];
  addressLabels: CreatePropertyLabels["address"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreatePropertyDeedStep({
  labels,
  addressLabels,
  onBack,
  onComplete,
}: CreatePropertyDeedStepProps) {
  const tIncomplete = useTranslations("createProperty");
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
    useManualDeedEntry,
    setUseManualDeedEntry,
    manualDeedEntry,
    setManualDeedEntry,
    needsFrontBack,
    isDeceasedOwner,
    isWaqfOwner,
    existingDeedImageUrl,
    existingDeedFrontImageUrl,
    existingDeedBackImageUrl,
    existingInheritanceImageUrl,
    existingHeirsPoaImageUrl,
    existingEndowmentCertImageUrl,
    existingTrusteeshipImageUrl,
    existingGuardiansPoaImageUrl,
    canContinue: canContinueDeed,
  } = useCreatePropertyDeedStep();
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
    canContinue: canContinueAddress,
  } = useCreatePropertyAddressStep();
  const { isSubmitting, submitStep1 } = useSubmitPropertyStep1();
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const deedTypePopup = useInstrumentTypeDeedPopup("realestate");
  const supportsManualEntry = propertyDeedTypeSupportsManualEntry(selectedDeedType);
  const hasExistingInstrument =
    Boolean(existingDeedImageUrl) ||
    Boolean(existingDeedFrontImageUrl) ||
    Boolean(existingDeedBackImageUrl);
  const allowManualEntry = supportsManualEntry && !hasExistingInstrument;

  function handleDeedTypeChange(value: PropertyDeedTypeId | "") {
    setSelectedDeedType(value);

    if (!value) {
      return;
    }

    void deedTypePopup.showPopupFor(value, labels.deedType.types[value]);
  }

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinueDeed || !canContinueAddress) {
      setShowFieldErrors(true);
      toast.error(tIncomplete("incompleteContinue"));
      return;
    }

    setShowFieldErrors(false);

    const result = await submitStep1();

    if (!result.ok) {
      toast.error(result.error || addressLabels.navigation.submitError);
      return;
    }

    onComplete();
  }

  function renderInstrumentEntry(upload: ReactNode) {
    if (!selectedDeedType) {
      return null;
    }

    if (!supportsManualEntry || !allowManualEntry) {
      return upload;
    }

    return (
      <DeedInstrumentEntrySection
        labels={labels.manualEntry}
        useManualDeedEntry={useManualDeedEntry}
        onUseManualDeedEntryChange={setUseManualDeedEntry}
        manualDeedEntry={manualDeedEntry}
        onManualDeedEntryChange={setManualDeedEntry}
        FormSelect={CreatePropertyFormSelect}
        FieldLabel={CreatePropertyFieldLabel}
        upload={upload}
      />
    );
  }

  function renderFrontBackUpload() {
    const instrumentInvalid = showFieldErrors && !useManualDeedEntry;

    return (
      <div className="space-y-6">
        <CreatePropertyDeedImageUpload
          labels={labels.deedImage}
          fieldLabel={labels.deedImage.frontLabel}
          value={deedFrontFiles}
          onChange={setDeedFrontFiles}
          existingFileUrl={existingDeedFrontImageUrl}
          variant="dropzone"
          invalid={
            instrumentInvalid &&
            deedFrontFiles.length === 0 &&
            !existingDeedFrontImageUrl
          }
        />

        <CreatePropertyDeedImageUpload
          labels={labels.deedImage}
          fieldLabel={labels.deedImage.backLabel}
          value={deedBackFiles}
          onChange={setDeedBackFiles}
          existingFileUrl={existingDeedBackImageUrl}
          variant="dropzone"
          invalid={
            instrumentInvalid &&
            deedBackFiles.length === 0 &&
            !existingDeedBackImageUrl
          }
        />
      </div>
    );
  }

  function renderSingleUpload() {
    return (
      <CreatePropertyDeedImageUpload
        labels={labels.deedImage}
        value={deedFiles}
        onChange={setDeedFiles}
        existingFileUrl={existingDeedImageUrl}
        variant="dropzone"
        invalid={
          showFieldErrors &&
          !useManualDeedEntry &&
          deedFiles.length === 0 &&
          !existingDeedImageUrl
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] bg-white p-5 shadow-sm md:p-8">
        <CreatePropertyStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
          showIcon={false}
        />

        <div className="space-y-8">
          <div className="space-y-5 rounded-[24px] bg-white p-4 md:p-5">
            <CreatePropertyDeedTypeSelect
              labels={labels.deedType}
              value={selectedDeedType}
              onChange={handleDeedTypeChange}
              invalid={showFieldErrors && selectedDeedType === ""}
            />

            {selectedDeedType && needsFrontBack ? (
              <div className="space-y-6">
                {renderInstrumentEntry(renderFrontBackUpload())}
              </div>
            ) : selectedDeedType && isDeceasedOwner ? (
              <div className="space-y-6">
                {renderInstrumentEntry(renderSingleUpload())}

                <CreatePropertyDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.inheritanceLabel}
                  value={deedInheritanceFiles}
                  onChange={setDeedInheritanceFiles}
                  existingFileUrl={existingInheritanceImageUrl}
                  variant="dropzone"
                  invalid={
                    showFieldErrors &&
                    deedInheritanceFiles.length === 0 &&
                    !existingInheritanceImageUrl
                  }
                />

                <CreatePropertyDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.heirsPoaLabel}
                  value={deedHeirsPoaFiles}
                  onChange={setDeedHeirsPoaFiles}
                  existingFileUrl={existingHeirsPoaImageUrl}
                  variant="dropzone"
                  invalid={
                    showFieldErrors &&
                    deedHeirsPoaFiles.length === 0 &&
                    !existingHeirsPoaImageUrl
                  }
                />
              </div>
            ) : selectedDeedType && isWaqfOwner ? (
              <div className="space-y-6">
                {renderInstrumentEntry(renderSingleUpload())}

                <CreatePropertyDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.endowmentCertLabel}
                  value={deedEndowmentCertFiles}
                  onChange={setDeedEndowmentCertFiles}
                  existingFileUrl={existingEndowmentCertImageUrl}
                  variant="dropzone"
                  invalid={
                    showFieldErrors &&
                    deedEndowmentCertFiles.length === 0 &&
                    !existingEndowmentCertImageUrl
                  }
                />

                <CreatePropertyDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.trusteeshipLabel}
                  value={deedTrusteeshipFiles}
                  onChange={setDeedTrusteeshipFiles}
                  existingFileUrl={existingTrusteeshipImageUrl}
                  variant="dropzone"
                  invalid={
                    showFieldErrors &&
                    deedTrusteeshipFiles.length === 0 &&
                    !existingTrusteeshipImageUrl
                  }
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
                  <CreatePropertyDeedImageUpload
                    labels={labels.deedImage}
                    fieldLabel={labels.deedImage.guardiansPoaLabel}
                    value={deedGuardiansPoaFiles}
                    onChange={setDeedGuardiansPoaFiles}
                    existingFileUrl={existingGuardiansPoaImageUrl}
                    variant="dropzone"
                    invalid={
                      showFieldErrors &&
                      deedGuardiansPoaFiles.length === 0 &&
                      !existingGuardiansPoaImageUrl
                    }
                  />
                ) : null}
              </div>
            ) : selectedDeedType ? (
              renderInstrumentEntry(renderSingleUpload())
            ) : null}
          </div>

          <div className="space-y-6 border-t border-dashed border-[#d9d9d9] pt-8">
            <CreatePropertyStepPhaseHeader
              title={addressLabels.title}
              subtitle={addressLabels.subtitle}
              showIcon={false}
            />

            <CreatePropertyNationalAddress
              labels={addressLabels.nationalAddress}
              method={method}
              onMethodChange={setMethod}
              photoFiles={photoFiles}
              onPhotoFilesChange={setPhotoFiles}
              existingPhotoUrl={existingAddressImageUrl}
              linkUrl={linkUrl}
              onLinkUrlChange={setLinkUrl}
              manualAddress={manualAddress}
              onManualAddressChange={setManualAddress}
              showFieldErrors={showFieldErrors}
            />
          </div>
        </div>
      </div>

      <CreatePropertyStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting
            ? addressLabels.navigation.submitting
            : labels.navigation.continue
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
