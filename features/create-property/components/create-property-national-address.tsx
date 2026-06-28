"use client";

import dynamic from "next/dynamic";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import {
  PROPERTY_NATIONAL_ADDRESS_METHODS,
  type PropertyNationalAddressMapLocation,
  type PropertyNationalAddressMethodId,
} from "@/features/create-property/types/national-address";
import type { OsmMapLocation } from "@/features/shared/components/osm-location-picker-map";
import { cn } from "@/lib/utils";

const OsmLocationPickerMap = dynamic(
  () => import("@/features/shared/components/osm-location-picker-map"),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 animate-pulse rounded-3xl border border-[#e8e8e8] bg-brand-background md:h-80" />
    ),
  },
);

type CreatePropertyNationalAddressProps = {
  labels: CreatePropertyLabels["address"]["nationalAddress"];
  method: PropertyNationalAddressMethodId;
  onMethodChange: (method: PropertyNationalAddressMethodId) => void;
  photoFiles: File[];
  onPhotoFilesChange: (files: File[]) => void;
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  mapLocation: PropertyNationalAddressMapLocation;
  onMapLocationChange: (location: PropertyNationalAddressMapLocation) => void;
};

export default function CreatePropertyNationalAddress({
  labels,
  method,
  onMethodChange,
  photoFiles,
  onPhotoFilesChange,
  linkUrl,
  onLinkUrlChange,
  mapLocation,
  onMapLocationChange,
}: CreatePropertyNationalAddressProps) {
  const linkInputId = useId();

  function handleMapLocationChange(location: OsmMapLocation) {
    onMapLocationChange(location);
  }

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
        <OsmLocationPickerMap
          value={mapLocation}
          onChange={handleMapLocationChange}
          mapTitle={labels.mapTitle}
          hint={labels.mapHint}
          coordinatesLabel={labels.coordinatesLabel}
        />
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
