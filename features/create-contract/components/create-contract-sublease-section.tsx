"use client";

import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractSubleaseSectionProps = {
  labels: CreateContractLabels["deed"]["sublease"];
  deedImageLabels: CreateContractLabels["deed"]["deedImage"];
  value: File[];
  onChange: (files: File[]) => void;
  existingImageUrl?: string | null;
  showFieldErrors?: boolean;
};

export default function CreateContractSubleaseSection({
  labels,
  deedImageLabels,
  value,
  onChange,
  existingImageUrl = null,
  showFieldErrors = false,
}: CreateContractSubleaseSectionProps) {
  const uploadInvalid =
    showFieldErrors && value.length === 0 && !existingImageUrl;

  return (
    <div className="space-y-3 rounded-[24px] border border-[#ececec] bg-white p-3 md:p-4">
      <div className="rounded-2xl bg-[#edf5ff] px-4 py-4 text-[#2f6fed] md:px-5">
        <p className="mb-2 text-sm font-extrabold">{labels.alertTitle}</p>
        <ol className="space-y-1.5 text-sm font-medium leading-relaxed">
          {labels.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ol>
      </div>

      <CreateContractDeedImageUpload
        labels={{
          ...deedImageLabels,
          label: labels.uploadLabel,
          acceptedFormats: "pdf",
        }}
        fieldLabel={labels.uploadLabel}
        value={value}
        onChange={onChange}
        existingImageUrl={existingImageUrl}
        single
        variant="dashed-pill"
        accept="application/pdf"
        hint={labels.pdfHint}
        invalid={uploadInvalid}
      />
    </div>
  );
}
