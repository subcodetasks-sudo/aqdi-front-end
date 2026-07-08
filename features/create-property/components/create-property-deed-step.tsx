"use client";

import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";
import CreatePropertyDeedTypeSelect from "@/features/create-property/components/create-property-deed-type-select";
import CreatePropertyStepNavigation from "@/features/create-property/components/create-property-step-navigation";
import CreatePropertyStepPhaseHeader from "@/features/create-property/components/create-property-step-phase-header";
import { Switch } from "@/components/ui/switch";
import { useCreatePropertyDeedStep } from "@/features/create-property/hooks/use-create-property-deed-step";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

type CreatePropertyDeedStepProps = {
  labels: CreatePropertyLabels["deed"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreatePropertyDeedStep({
  labels,
  onBack,
  onComplete,
}: CreatePropertyDeedStepProps) {
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
    existingDeedImageUrl,
    existingDeedFrontImageUrl,
    existingDeedBackImageUrl,
    existingInheritanceImageUrl,
    existingHeirsPoaImageUrl,
    existingEndowmentCertImageUrl,
    existingTrusteeshipImageUrl,
    existingGuardiansPoaImageUrl,
    canContinue,
  } = useCreatePropertyDeedStep();

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
        />

        <div className="space-y-6">
          <CreatePropertyDeedTypeSelect
            labels={labels.deedType}
            value={selectedDeedType}
            onChange={setSelectedDeedType}
          />

          {selectedDeedType && needsFrontBack ? (
            <div className="space-y-6">
              <CreatePropertyDeedImageUpload
                labels={labels.deedImage}
                fieldLabel={labels.deedImage.frontLabel}
                value={deedFrontFiles}
                onChange={setDeedFrontFiles}
                existingFileUrl={existingDeedFrontImageUrl}
              />

              <CreatePropertyDeedImageUpload
                labels={labels.deedImage}
                fieldLabel={labels.deedImage.backLabel}
                value={deedBackFiles}
                onChange={setDeedBackFiles}
                existingFileUrl={existingDeedBackImageUrl}
              />
            </div>
          ) : selectedDeedType && isDeceasedOwner ? (
            <div className="space-y-6">
              <CreatePropertyDeedImageUpload
                labels={labels.deedImage}
                value={deedFiles}
                onChange={setDeedFiles}
                existingFileUrl={existingDeedImageUrl}
              />

              <CreatePropertyDeedImageUpload
                labels={labels.deedImage}
                fieldLabel={labels.deedImage.inheritanceLabel}
                value={deedInheritanceFiles}
                onChange={setDeedInheritanceFiles}
                existingFileUrl={existingInheritanceImageUrl}
              />

              <CreatePropertyDeedImageUpload
                labels={labels.deedImage}
                fieldLabel={labels.deedImage.heirsPoaLabel}
                value={deedHeirsPoaFiles}
                onChange={setDeedHeirsPoaFiles}
                existingFileUrl={existingHeirsPoaImageUrl}
              />
            </div>
          ) : selectedDeedType && isWaqfOwner ? (
            <div className="space-y-6">
              <CreatePropertyDeedImageUpload
                labels={labels.deedImage}
                value={deedFiles}
                onChange={setDeedFiles}
                existingFileUrl={existingDeedImageUrl}
              />

              <CreatePropertyDeedImageUpload
                labels={labels.deedImage}
                fieldLabel={labels.deedImage.endowmentCertLabel}
                value={deedEndowmentCertFiles}
                onChange={setDeedEndowmentCertFiles}
                existingFileUrl={existingEndowmentCertImageUrl}
              />

              <CreatePropertyDeedImageUpload
                labels={labels.deedImage}
                fieldLabel={labels.deedImage.trusteeshipLabel}
                value={deedTrusteeshipFiles}
                onChange={setDeedTrusteeshipFiles}
                existingFileUrl={existingTrusteeshipImageUrl}
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
                />
              ) : null}
            </div>
          ) : selectedDeedType ? (
            <CreatePropertyDeedImageUpload
              labels={labels.deedImage}
              value={deedFiles}
              onChange={setDeedFiles}
              existingFileUrl={existingDeedImageUrl}
            />
          ) : null}
        </div>
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
