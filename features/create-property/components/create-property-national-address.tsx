"use client";



import dynamic from "next/dynamic";

import { useId } from "react";



import { Input } from "@/components/ui/input";

import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";

import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";

import CreatePropertyFormSelect from "@/features/create-property/components/create-property-form-select";

import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

import {

  PROPERTY_NATIONAL_ADDRESS_METHODS,

  type PropertyNationalAddressMapLocation,

  type PropertyNationalAddressMethodId,

} from "@/features/create-property/types/national-address";

import ManualNationalAddressForm from "@/features/shared/components/manual-national-address-form";

import type { ManualNationalAddressData } from "@/features/shared/types/manual-national-address";

import type { OsmMapLocation } from "@/features/shared/components/osm-location-picker-map";



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

  existingPhotoUrl?: string | null;

  linkUrl: string;

  onLinkUrlChange: (url: string) => void;

  manualAddress: ManualNationalAddressData;

  onManualAddressChange: (value: ManualNationalAddressData) => void;

  mapLocation: PropertyNationalAddressMapLocation;

  onMapLocationChange: (location: PropertyNationalAddressMapLocation) => void;

};



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

  mapLocation,

  onMapLocationChange,

}: CreatePropertyNationalAddressProps) {

  const linkInputId = useId();



  const methodOptions = PROPERTY_NATIONAL_ADDRESS_METHODS.map((methodId) => ({

    value: methodId,

    label: labels.methods[methodId],

  }));



  function handleMapLocationChange(location: OsmMapLocation) {

    onMapLocationChange(location);

  }



  return (

    <div className="space-y-4">

      <CreatePropertyFormSelect

        label={labels.methodSelect.label}

        placeholder={labels.methodSelect.placeholder}

        options={methodOptions}

        value={method}

        onChange={(nextMethod) =>

          onMethodChange(nextMethod as PropertyNationalAddressMethodId)

        }

      />



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

          existingFileUrl={existingPhotoUrl}

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

