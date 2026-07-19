"use client";

import { useId, type ReactNode } from "react";
import { IdCard, MapPin, PenLine } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import type { NationalAddressMethodId } from "@/features/create-contract/types/national-address";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import ManualNationalAddressForm from "@/features/shared/components/manual-national-address-form";
import type { ManualNationalAddressData } from "@/features/shared/types/manual-national-address";
import { cn } from "@/lib/utils";

type CreateContractDeedNationalAddressProps = {
  labels: CreateContractLabels["deed"]["nationalAddress"];
  method: NationalAddressMethodId | "";
  onMethodChange: (method: NationalAddressMethodId) => void;
  photoFiles: File[];
  onPhotoFilesChange: (files: File[]) => void;
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  manualAddress: ManualNationalAddressData;
  onManualAddressChange: (value: ManualNationalAddressData) => void;
  existingPhotoUrl?: string | null;
};

const METHOD_CARDS: {
  id: NationalAddressMethodId;
  icon: ReactNode;
}[] = [
  {
    id: "link",
    icon: <FaMapMarkerAlt className="size-7 text-[#ea4335]" aria-hidden />,
  },
  {
    id: "manual",
    icon: <PenLine className="size-7 text-brand-secondary" aria-hidden />,
  },
  {
    id: "photo",
    icon: (
      <span className="relative inline-flex size-8 items-center justify-center">
        <IdCard className="size-7 text-brand" aria-hidden />
        <MapPin className="absolute -inset-e-0.5 -top-0.5 size-3.5 text-brand-secondary" aria-hidden />
      </span>
    ),
  },
];

export default function CreateContractDeedNationalAddress({
  labels,
  method,
  onMethodChange,
  photoFiles,
  onPhotoFilesChange,
  linkUrl,
  onLinkUrlChange,
  manualAddress,
  onManualAddressChange,
  existingPhotoUrl = null,
}: CreateContractDeedNationalAddressProps) {
  const linkInputId = useId();
  const methodGroupId = useId();

  return (
    <div className="space-y-4">
      <div>
        <CreateContractFieldLabel label={labels.methodSelect.label} />

        <div
          role="radiogroup"
          aria-labelledby={methodGroupId}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <span id={methodGroupId} className="sr-only">
            {labels.methodSelect.label}
          </span>

          {METHOD_CARDS.map((card) => {
            const selected = method === card.id;
            const copy = labels.methods[card.id];

            return (
              <button
                key={card.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onMethodChange(card.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border px-3 py-5 text-center transition-colors",
                  selected
                    ? "border-brand bg-brand-background-green/50"
                    : "border-[#e8e8e8] bg-white hover:border-brand/30",
                )}
              >
                <span className="flex size-12 items-center justify-center">
                  {card.icon}
                </span>
                <span className="text-sm font-extrabold text-brand">
                  {copy.title}
                </span>
                <span className="text-xs text-[#9a9a9a]">{copy.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {method === "photo" ? (
        <CreateContractDeedImageUpload
          labels={labels.photo}
          value={photoFiles}
          onChange={onPhotoFilesChange}
          existingImageUrl={existingPhotoUrl}
        />
      ) : null}

      {method === "link" ? (
        <div className="space-y-3">
          <CreateContractFieldLabel label={labels.link.label} />

          <Input
            id={linkInputId}
            type="url"
            value={linkUrl}
            onChange={(event) => onLinkUrlChange(event.target.value)}
            placeholder={labels.link.placeholder}
            className="h-14 rounded-full border-[#e8e8e8] bg-brand-background px-4 text-sm text-[#333333] placeholder:text-[#bdbdbd] focus-visible:ring-brand-secondary/20"
          />
        </div>
      ) : null}

      {method === "manual" ? (
        <ManualNationalAddressForm
          labels={labels.manual}
          value={manualAddress}
          onChange={onManualAddressChange}
        />
      ) : null}
    </div>
  );
}
