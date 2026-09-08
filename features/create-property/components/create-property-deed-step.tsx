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
import {
  propertyDeedTypeIsAdversePossession,
  propertyDeedTypeIsEconomicCitiesAuthority,
  propertyDeedTypeIsPaper,
  propertyDeedTypeIsSalePaper,
} from "@/features/create-property/types/deed-type";
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
    hasMinorHeirs,
    setHasMinorHeirs,
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
    clearExistingFileUrl,
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
    clearExistingAddressImageUrl,
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
        showFieldErrors={showFieldErrors}
      />
    );
  }

  function renderFrontBackUpload() {
    const instrumentInvalid = showFieldErrors && !useManualDeedEntry;

    return (
      <div className="space-y-3">
        <CreatePropertyDeedImageUpload
          labels={labels.deedImage}
          fieldLabel={labels.deedImage.frontLabel}
          value={deedFrontFiles}
          onChange={setDeedFrontFiles}
          existingFileUrl={existingDeedFrontImageUrl}
          onClearExisting={() => clearExistingFileUrl("existingDeedFrontImageUrl")}
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
          onClearExisting={() => clearExistingFileUrl("existingDeedBackImageUrl")}
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
        fieldLabel={
          propertyDeedTypeIsSalePaper(selectedDeedType)
            ? labels.deedImage.salePaperLabel
            : propertyDeedTypeIsAdversePossession(selectedDeedType)
              ? labels.deedImage.adversePossessionLabel
              : propertyDeedTypeIsEconomicCitiesAuthority(selectedDeedType)
                ? labels.deedImage.economicCitiesLabel
                : propertyDeedTypeIsPaper(selectedDeedType)
                  ? labels.deedImage.paperLabel
                  : undefined
        }
        value={deedFiles}
        onChange={setDeedFiles}
        existingFileUrl={existingDeedImageUrl}
        onClearExisting={() => clearExistingFileUrl("existingDeedImageUrl")}
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
      <div className="rounded-b-[28px] bg-white p-3 md:p-5 dark:bg-[#1a2421]">
        <CreatePropertyStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
        />

        <div className="space-y-4">
          <div className="space-y-3 rounded-[24px] bg-white p-3 md:p-4">
            <CreatePropertyDeedTypeSelect
              labels={labels.deedType}
              value={selectedDeedType}
              onChange={handleDeedTypeChange}
              invalid={showFieldErrors && selectedDeedType === ""}
            />

            {selectedDeedType && needsFrontBack ? (
              <div className="space-y-3">
                {renderInstrumentEntry(renderFrontBackUpload())}
              </div>
            ) : selectedDeedType && isDeceasedOwner ? (
              <div className="space-y-3">
                {renderInstrumentEntry(
                  <CreatePropertyDeedImageUpload
                    labels={{
                      ...labels.deedImage,
                      clickHere: labels.deceased.clickHere,
                      chooseFile: labels.deceased.chooseFile,
                    }}
                    fieldLabel={labels.deceased.deedLabel}
                    value={deedFiles}
                    onChange={setDeedFiles}
                    existingFileUrl={existingDeedImageUrl}
                    onClearExisting={() =>
                      clearExistingFileUrl("existingDeedImageUrl")
                    }
                    variant="dropzone"
                    invalid={
                      showFieldErrors &&
                      deedFiles.length === 0 &&
                      !existingDeedImageUrl
                    }
                  />,
                )}

                <CreatePropertyDeedImageUpload
                  labels={{
                    ...labels.deedImage,
                    clickHere: labels.deceased.clickHere,
                    chooseFile: labels.deceased.chooseFile,
                  }}
                  fieldLabel={labels.deceased.inheritanceLabel}
                  value={deedInheritanceFiles}
                  onChange={setDeedInheritanceFiles}
                  existingFileUrl={existingInheritanceImageUrl}
                  onClearExisting={() =>
                    clearExistingFileUrl("existingInheritanceImageUrl")
                  }
                  variant="dropzone"
                  invalid={
                    showFieldErrors &&
                    deedInheritanceFiles.length === 0 &&
                    !existingInheritanceImageUrl
                  }
                />

                <div className="space-y-2">
                  <CreatePropertyDeedImageUpload
                    labels={{
                      ...labels.deedImage,
                      clickHere: labels.deceased.clickHere,
                      chooseFile: labels.deceased.chooseFile,
                    }}
                    fieldLabel={labels.deceased.heirsPoaLabel}
                    value={deedHeirsPoaFiles}
                    onChange={setDeedHeirsPoaFiles}
                    existingFileUrl={existingHeirsPoaImageUrl}
                    onClearExisting={() =>
                      clearExistingFileUrl("existingHeirsPoaImageUrl")
                    }
                    variant="dropzone"
                    invalid={
                      showFieldErrors &&
                      deedHeirsPoaFiles.length === 0 &&
                      !existingHeirsPoaImageUrl
                    }
                  />
                  <p className="text-xs leading-relaxed text-[#9a9a9a]">
                    {labels.deceased.najizHint}
                  </p>
                </div>

                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[24px] border border-[#ececec] bg-white px-4 py-4 md:px-5">
                  <span className="text-sm font-semibold text-[#333333]">
                    {labels.deceased.minorHeirsLabel}
                  </span>
                  <Switch
                    dir="ltr"
                    checked={hasMinorHeirs}
                    onCheckedChange={setHasMinorHeirs}
                    className="h-6 w-11 shrink-0 data-checked:bg-brand data-unchecked:bg-[#d9d9d9]"
                  />
                </label>

                {hasMinorHeirs ? (
                  <div className="space-y-2">
                    <CreatePropertyDeedImageUpload
                      labels={{
                        ...labels.deedImage,
                        clickHere: labels.deceased.clickHere,
                        chooseFile: labels.deceased.chooseFile,
                      }}
                      fieldLabel={labels.deceased.guardiansPoaLabel}
                      value={deedGuardiansPoaFiles}
                      onChange={setDeedGuardiansPoaFiles}
                      existingFileUrl={existingGuardiansPoaImageUrl}
                      onClearExisting={() =>
                        clearExistingFileUrl("existingGuardiansPoaImageUrl")
                      }
                      variant="dropzone"
                      invalid={
                        showFieldErrors &&
                        deedGuardiansPoaFiles.length === 0 &&
                        !existingGuardiansPoaImageUrl
                      }
                    />
                    <p className="text-xs leading-relaxed text-[#9a9a9a]">
                      {labels.deceased.guardiansPoaHint}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : selectedDeedType && isWaqfOwner ? (
              <div className="space-y-3">
                {renderInstrumentEntry(renderSingleUpload())}

                <CreatePropertyDeedImageUpload
                  labels={labels.deedImage}
                  fieldLabel={labels.deedImage.endowmentCertLabel}
                  value={deedEndowmentCertFiles}
                  onChange={setDeedEndowmentCertFiles}
                  existingFileUrl={existingEndowmentCertImageUrl}
                  onClearExisting={() =>
                    clearExistingFileUrl("existingEndowmentCertImageUrl")
                  }
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
                  onClearExisting={() =>
                    clearExistingFileUrl("existingTrusteeshipImageUrl")
                  }
                  variant="dropzone"
                  invalid={
                    showFieldErrors &&
                    deedTrusteeshipFiles.length === 0 &&
                    !existingTrusteeshipImageUrl
                  }
                />

                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-black">
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
                  <div className="space-y-2">
                    <CreatePropertyDeedImageUpload
                      labels={labels.deedImage}
                      fieldLabel={labels.deedImage.guardiansPoaLabel}
                      value={deedGuardiansPoaFiles}
                      onChange={setDeedGuardiansPoaFiles}
                      existingFileUrl={existingGuardiansPoaImageUrl}
                      onClearExisting={() =>
                        clearExistingFileUrl("existingGuardiansPoaImageUrl")
                      }
                      variant="dropzone"
                      invalid={
                        showFieldErrors &&
                        deedGuardiansPoaFiles.length === 0 &&
                        !existingGuardiansPoaImageUrl
                      }
                    />
                    <p className="text-xs leading-relaxed text-[#9a9a9a]">
                      {labels.waqf.trusteesPoaHint}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : selectedDeedType ? (
              renderInstrumentEntry(renderSingleUpload())
            ) : null}
          </div>

          {selectedDeedType ? (
            <div className="space-y-3 border-t border-dashed border-[#d9d9d9] pt-4">
              <CreatePropertyStepPhaseHeader
                title={addressLabels.title}
                subtitle={addressLabels.subtitle}
              />

              <CreatePropertyNationalAddress
                labels={addressLabels.nationalAddress}
                method={method}
                onMethodChange={setMethod}
                photoFiles={photoFiles}
                onPhotoFilesChange={setPhotoFiles}
                existingPhotoUrl={existingAddressImageUrl}
                onClearExistingPhoto={clearExistingAddressImageUrl}
                linkUrl={linkUrl}
                onLinkUrlChange={setLinkUrl}
                manualAddress={manualAddress}
                onManualAddressChange={setManualAddress}
                showFieldErrors={showFieldErrors}
              />
            </div>
          ) : null}
        </div>

        <CreatePropertyStepNavigation
          previousLabel={labels.navigation.previous}
          continueLabel={
            isSubmitting
              ? addressLabels.navigation.submitting
              : labels.navigation.continue
          }
          isSubmitting={isSubmitting}
          onPrevious={onBack}
          onContinue={() => void handleContinue()}
        />
      </div>

      <InstrumentTypePopupDialog
        open={deedTypePopup.open}
        onOpenChange={deedTypePopup.setOpen}
        popup={deedTypePopup.popup}
        deedTypeLabel={deedTypePopup.deedTypeLabel}
      />
    </div>
  );
}
