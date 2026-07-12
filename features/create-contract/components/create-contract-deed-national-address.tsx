"use client";



import dynamic from "next/dynamic";

import { useId } from "react";



import { Input } from "@/components/ui/input";

import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";

import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";

import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";

import type { NationalAddressMethodId } from "@/features/create-contract/types/national-address";

import {

  NATIONAL_ADDRESS_METHODS,

  type NationalAddressMapLocation,

} from "@/features/create-contract/types/national-address";

import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

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



type CreateContractDeedNationalAddressProps = {

  labels: CreateContractLabels["deed"]["nationalAddress"];

  method: NationalAddressMethodId;

  onMethodChange: (method: NationalAddressMethodId) => void;

  photoFiles: File[];

  onPhotoFilesChange: (files: File[]) => void;

  linkUrl: string;

  onLinkUrlChange: (url: string) => void;

  manualAddress: ManualNationalAddressData;

  onManualAddressChange: (value: ManualNationalAddressData) => void;

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

  manualAddress,

  onManualAddressChange,

  mapLocation,

  onMapLocationChange,

  existingPhotoUrl = null,

}: CreateContractDeedNationalAddressProps) {

  const linkInputId = useId();



  const methodOptions = NATIONAL_ADDRESS_METHODS.map((methodId) => ({

    value: methodId,

    label: labels.methods[methodId],

  }));



  function handleMapLocationChange(location: OsmMapLocation) {

    onMapLocationChange(location);

  }



  return (

    <div className="space-y-4">

      <CreateContractFormSelect

        label={labels.methodSelect.label}

        placeholder={labels.methodSelect.placeholder}

        options={methodOptions}

        value={method}

        onChange={(nextMethod) =>

          onMethodChange(nextMethod as NationalAddressMethodId)

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

