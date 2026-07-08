"use client";

import dynamic from "next/dynamic";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import type { NationalAddressMethodId } from "@/features/create-contract/types/national-address";
import {
  NATIONAL_ADDRESS_METHODS,
  type NationalAddressMapLocation,
} from "@/features/create-contract/types/national-address";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
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

type CreateContractDeedNationalAddressProps = {
  labels: CreateContractLabels["deed"]["nationalAddress"];
  method: NationalAddressMethodId;
  onMethodChange: (method: NationalAddressMethodId) => void;
  photoFiles: File[];
  onPhotoFilesChange: (files: File[]) => void;
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  mapLocation: NationalAddressMapLocation;
  onMapLocationChange: (location: NationalAddressMapLocation) => void;
  existingPhotoUrl?: string | null;
};

export default function CreateContractDeedNationalAddress({
  labels,
  method,
  onMethodChange,
  photoFiles,
  onPhotoFilesChange,
  linkUrl,
  onLinkUrlChange,
  mapLocation,
  onMapLocationChange,
  existingPhotoUrl = null,
}: CreateContractDeedNationalAddressProps) {
  const linkInputId = useId();

  function handleMapLocationChange(location: OsmMapLocation) {
    onMapLocationChange(location);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center rounded-full border border-[#e8e8e8] bg-brand-background p-1">
        {labels.methods.map((methodLabel, index) => {
          const methodId = NATIONAL_ADDRESS_METHODS[index];

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
    </div>
  );
}
