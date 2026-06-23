"use client";

import { Input } from "@/components/ui/input";
import { useId } from "react";

import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import {
  PROPERTY_NATIONAL_ADDRESS_METHODS,
  type PropertyNationalAddressMapLocation,
  type PropertyNationalAddressMethodId,
} from "@/features/create-property/types/national-address";
import { cn } from "@/lib/utils";

type CreatePropertyNationalAddressProps = {
  labels: CreatePropertyLabels["address"]["nationalAddress"];
  method: PropertyNationalAddressMethodId;
  onMethodChange: (method: PropertyNationalAddressMethodId) => void;
  photoFiles: File[];
  onPhotoFilesChange: (files: File[]) => void;
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  mapLocation: PropertyNationalAddressMapLocation;
};

function getMapEmbedUrl(lat: number, lng: number) {
  const delta = 0.02;
  const bbox = [
    lng - delta,
    lat - delta,
    lng + delta,
    lat + delta,
  ].join("%2C");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function CreatePropertyNationalAddress({
  labels,
  method,
  onMethodChange,
  photoFiles,
  onPhotoFilesChange,
  linkUrl,
  onLinkUrlChange,
  mapLocation,
}: CreatePropertyNationalAddressProps) {
  const linkInputId = useId();
  const { lat, lng } = mapLocation;

  return (
    <div className="space-y-4">
      <div className="flex items-center rounded-full border border-[#e8e8e8] bg-brand-background p-1">
        {labels.methods.map((methodLabel, index) => {
          const methodId = PROPERTY_NATIONAL_ADDRESS_METHODS[index];

          return (
            <button
              key={methodId}
              type="button"
              onClick={() => onMethodChange(methodId)}
              className={cn(
                "flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors",
                method === methodId
                  ? "bg-brand text-white"
                  : "text-[#7f7f7f] hover:text-[#555555]",
              )}
            >
              {methodLabel}
            </button>
          );
        })}
      </div>

      {method === "map" ? (
        <div className="relative overflow-hidden rounded-3xl border border-[#e8e8e8]">
          <iframe
            title={labels.mapTitle}
            src={getMapEmbedUrl(lat, lng)}
            className="h-72 w-full border-0 md:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <span
            className="pointer-events-none absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary ring-4 ring-brand-secondary/25"
            aria-hidden="true"
          />
        </div>
      ) : null}

      {method === "photo" ? (
        <CreatePropertyDeedImageUpload
          labels={labels.photo}
          value={photoFiles}
          onChange={onPhotoFilesChange}
        />
      ) : null}

      {method === "link" ? (
        <div className="space-y-3">
          <CreatePropertyFieldLabel label={labels.link.label} />

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
    </div>
  );
}
