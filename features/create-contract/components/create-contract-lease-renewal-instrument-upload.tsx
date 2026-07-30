"use client";

import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractLeaseRenewalInstrumentUploadProps = {
  labels: CreateContractLabels["deed"]["leaseRenewal"];
  deedImageLabels: CreateContractLabels["deed"]["deedImage"];
  value: File[];
  onChange: (files: File[]) => void;
  existingImageUrl?: string | null;
  showFieldErrors?: boolean;
};

export default function CreateContractLeaseRenewalInstrumentUpload({
  labels,
  deedImageLabels,
  value,
  onChange,
  existingImageUrl = null,
  showFieldErrors = false,
}: CreateContractLeaseRenewalInstrumentUploadProps) {
  const uploadInvalid =
    showFieldErrors && value.length === 0 && !existingImageUrl;

  return (
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
  );
}
