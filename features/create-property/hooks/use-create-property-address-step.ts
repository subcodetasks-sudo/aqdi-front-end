"use client";

import { useState } from "react";

import {
  canContinueNationalAddress,
  DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION,
  type PropertyNationalAddressMethodId,
} from "@/features/create-property/types/national-address";

export function useCreatePropertyAddressStep() {
  const [method, setMethod] = useState<PropertyNationalAddressMethodId>("map");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [mapLocation] = useState(DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION);

  const canContinue = canContinueNationalAddress(method, photoFiles, linkUrl);

  function handleMethodChange(nextMethod: PropertyNationalAddressMethodId) {
    setMethod(nextMethod);
  }

  return {
    method,
    setMethod: handleMethodChange,
    photoFiles,
    setPhotoFiles,
    linkUrl,
    setLinkUrl,
    mapLocation,
    canContinue,
  };
}
