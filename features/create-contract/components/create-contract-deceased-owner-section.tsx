"use client";

import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import { Switch } from "@/components/ui/switch";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractDeceasedOwnerSectionProps = {
  labels: CreateContractLabels["deed"]["deceased"];
  deedImageLabels: CreateContractLabels["deed"]["deedImage"];
  deedFiles: File[];
  onDeedFilesChange: (files: File[]) => void;
  existingDeedImageUrl?: string | null;
  inheritanceFiles: File[];
  onInheritanceFilesChange: (files: File[]) => void;
  existingInheritanceImageUrl?: string | null;
  heirsPoaFiles: File[];
  onHeirsPoaFilesChange: (files: File[]) => void;
  existingHeirsPoaImageUrl?: string | null;
  hasMinorHeirs: boolean;
  onHasMinorHeirsChange: (value: boolean) => void;
  guardiansPoaFiles: File[];
  onGuardiansPoaFilesChange: (files: File[]) => void;
  existingGuardiansPoaImageUrl?: string | null;
  showFieldErrors?: boolean;
};

export default function CreateContractDeceasedOwnerSection({
  labels,
  deedImageLabels,
  deedFiles,
  onDeedFilesChange,
  existingDeedImageUrl = null,
  inheritanceFiles,
  onInheritanceFilesChange,
  existingInheritanceImageUrl = null,
  heirsPoaFiles,
  onHeirsPoaFilesChange,
  existingHeirsPoaImageUrl = null,
  hasMinorHeirs,
  onHasMinorHeirsChange,
  guardiansPoaFiles,
  onGuardiansPoaFilesChange,
  existingGuardiansPoaImageUrl = null,
  showFieldErrors = false,
}: CreateContractDeceasedOwnerSectionProps) {
  const uploadLabels = {
    ...deedImageLabels,
    clickHere: labels.clickHere,
    chooseFile: labels.chooseFile,
    acceptedFormats: "",
  };

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <CreateContractDeedImageUpload
          labels={uploadLabels}
          fieldLabel={labels.deedLabel}
          single
          variant="dropzone"
          value={deedFiles}
          onChange={onDeedFilesChange}
          existingImageUrl={existingDeedImageUrl}
          invalid={
            showFieldErrors && deedFiles.length === 0 && !existingDeedImageUrl
          }
        />

        <CreateContractDeedImageUpload
          labels={uploadLabels}
          fieldLabel={labels.inheritanceLabel}
          single
          variant="dropzone"
          value={inheritanceFiles}
          onChange={onInheritanceFilesChange}
          existingImageUrl={existingInheritanceImageUrl}
          invalid={
            showFieldErrors &&
            inheritanceFiles.length === 0 &&
            !existingInheritanceImageUrl
          }
        />

        <CreateContractDeedImageUpload
          labels={uploadLabels}
          fieldLabel={labels.heirsPoaLabel}
          single
          variant="dropzone"
          value={heirsPoaFiles}
          onChange={onHeirsPoaFilesChange}
          existingImageUrl={existingHeirsPoaImageUrl}
          hint={labels.najizHint}
          invalid={
            showFieldErrors &&
            heirsPoaFiles.length === 0 &&
            !existingHeirsPoaImageUrl
          }
        />
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[24px] border border-[#ececec] bg-white px-4 py-4 md:px-5">
        <span className="text-sm font-semibold text-[#333333]">
          {labels.minorHeirsLabel}
        </span>
        <Switch
          dir="ltr"
          checked={hasMinorHeirs}
          onCheckedChange={onHasMinorHeirsChange}
          className="h-6 w-11 shrink-0 data-checked:bg-brand data-unchecked:bg-[#d9d9d9]"
        />
      </label>

      {hasMinorHeirs ? (
        <CreateContractDeedImageUpload
          labels={uploadLabels}
          fieldLabel={labels.guardiansPoaLabel}
          single
          variant="dropzone"
          value={guardiansPoaFiles}
          onChange={onGuardiansPoaFilesChange}
          existingImageUrl={existingGuardiansPoaImageUrl}
          invalid={
            showFieldErrors &&
            guardiansPoaFiles.length === 0 &&
            !existingGuardiansPoaImageUrl
          }
        />
      ) : null}
    </div>
  );
}
