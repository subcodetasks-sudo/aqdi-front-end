"use client";

import { useId, type ReactNode } from "react";
import { IdCard, Link2, MapPin, PenLine } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyNationalAddressMethodId } from "@/features/create-property/types/national-address";
import ManualNationalAddressForm from "@/features/shared/components/manual-national-address-form";
import type { ManualNationalAddressData } from "@/features/shared/types/manual-national-address";
import { cn } from "@/lib/utils";

type CreatePropertyNationalAddressProps = {
  labels: CreatePropertyLabels["address"]["nationalAddress"];
  method: PropertyNationalAddressMethodId | "";
  onMethodChange: (method: PropertyNationalAddressMethodId) => void;
  photoFiles: File[];
  onPhotoFilesChange: (files: File[]) => void;
  existingPhotoUrl?: string | null;
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  manualAddress: ManualNationalAddressData;
  onManualAddressChange: (value: ManualNationalAddressData) => void;
  showFieldErrors?: boolean;
};

const METHOD_CARDS: {
  id: PropertyNationalAddressMethodId;
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
        <MapPin
          className="absolute -inset-e-0.5 -top-0.5 size-3.5 text-brand-secondary"
          aria-hidden
        />
      </span>
    ),
  },
];

export default function CreatePropertyNationalAddress({
  labels,
  method,
  onMethodChange,
  photoFiles,
  onPhotoFilesChange,
  existingPhotoUrl = null,
  linkUrl,
  onLinkUrlChange,
  manualAddress,
  onManualAddressChange,
  showFieldErrors = false,
}: CreatePropertyNationalAddressProps) {
  const linkInputId = useId();
  const methodGroupId = useId();
  const methodInvalid = showFieldErrors && method === "";
  const photoInvalid =
    showFieldErrors &&
    method === "photo" &&
    photoFiles.length === 0 &&
    !existingPhotoUrl;
  const linkInvalid =
    showFieldErrors && method === "link" && linkUrl.trim() === "";
  const linkValid = method === "link" && linkUrl.trim() !== "";

  return (
    <div className="space-y-5">
      <div>
        <CreatePropertyFieldLabel
          label={labels.methodSelect.label}
          invalid={methodInvalid}
        />

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
                    ? "border-brand bg-brand-background-green/60 shadow-[0_0_0_1px_rgba(13,90,80,0.08)]"
                    : methodInvalid
                      ? "border-[#e57373] bg-white"
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
        <CreatePropertyDeedImageUpload
          labels={labels.photo}
          value={photoFiles}
          onChange={onPhotoFilesChange}
          existingFileUrl={existingPhotoUrl}
          variant="dropzone"
          invalid={photoInvalid}
        />
      ) : null}

      {method === "link" ? (
        <div className="space-y-2">
          <CreatePropertyFieldLabel
            label={labels.link.label}
            invalid={linkInvalid}
          />

          <div className="relative">
            <Link2
              className={cn(
                "pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2",
                linkInvalid
                  ? "text-[#c62828]"
                  : linkValid
                    ? "text-brand"
                    : "text-brand-secondary",
              )}
              aria-hidden="true"
            />
            <Input
              id={linkInputId}
              type="url"
              value={linkUrl}
              onChange={(event) => onLinkUrlChange(event.target.value)}
              placeholder={labels.link.placeholder}
              aria-invalid={linkInvalid}
              className={cn(
                "h-14 rounded-2xl ps-11 pe-4 text-sm text-[#333333] placeholder:text-[#bdbdbd] focus-visible:border-brand focus-visible:ring-brand/15",
                linkInvalid
                  ? "border-[#e57373] bg-white"
                  : linkValid
                    ? "border-brand bg-brand-background-green"
                    : "border-[#e4e4e4] bg-white",
              )}
            />
          </div>

          {labels.link.hint ? (
            <p className="text-xs leading-relaxed text-[#9a9a9a]">
              {labels.link.hint}
            </p>
          ) : null}
        </div>
      ) : null}

      {method === "manual" ? (
        <ManualNationalAddressForm
          labels={labels.manual}
          value={manualAddress}
          onChange={onManualAddressChange}
          showFieldErrors={showFieldErrors}
        />
      ) : null}
    </div>
  );
}
