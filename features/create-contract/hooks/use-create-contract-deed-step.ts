"use client";

import { useState } from "react";

import {
  DEED_STEP_PHASE_COUNT,
  type DeedTypeId,
} from "@/features/create-contract/types/deed-type";
import { type NationalAddressMethodId } from "@/features/create-contract/types/national-address";
import {
  EMPTY_PROPERTY_DETAILS,
  isPropertyDetailsComplete,
  type PropertyDetailsState,
} from "@/features/create-contract/types/property-details";

function canContinueNationalAddress(
  method: NationalAddressMethodId,
  photoFiles: File[],
  linkUrl: string,
) {
  if (method === "map") {
    return true;
  }

  if (method === "photo") {
    return photoFiles.length > 0;
  }

  return linkUrl.trim().length > 0;
}

export function useCreateContractDeedStep() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [selectedDeedType, setSelectedDeedTypeState] = useState<DeedTypeId | "">(
    "",
  );
  const [deedFiles, setDeedFiles] = useState<File[]>([]);
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyDetailsState>(EMPTY_PROPERTY_DETAILS);
  const [nationalAddressMethod, setNationalAddressMethod] =
    useState<NationalAddressMethodId>("map");
  const [nationalAddressPhotoFiles, setNationalAddressPhotoFiles] = useState<
    File[]
  >([]);
  const [nationalAddressLinkUrl, setNationalAddressLinkUrl] = useState("");

  const isLastPhase = currentPhaseIndex === DEED_STEP_PHASE_COUNT - 1;
  const canContinue =
    currentPhaseIndex === 0
      ? selectedDeedType !== "" && deedFiles.length > 0
      : currentPhaseIndex === 1
        ? isPropertyDetailsComplete(propertyDetails)
        : currentPhaseIndex === 2
          ? canContinueNationalAddress(
              nationalAddressMethod,
              nationalAddressPhotoFiles,
              nationalAddressLinkUrl,
            )
          : true;

  function setSelectedDeedType(value: DeedTypeId | "") {
    setSelectedDeedTypeState(value);

    if (value === "") {
      setDeedFiles([]);
    }
  }

  function handleNationalAddressMethodChange(method: NationalAddressMethodId) {
    setNationalAddressMethod(method);
  }

  function goToNextPhase() {
    if (currentPhaseIndex < DEED_STEP_PHASE_COUNT - 1) {
      setCurrentPhaseIndex((phase) => phase + 1);
    }
  }

  function goToPreviousPhase() {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex((phase) => phase - 1);
    }
  }

  return {
    currentPhaseIndex,
    selectedDeedType,
    setSelectedDeedType,
    deedFiles,
    setDeedFiles,
    propertyDetails,
    setPropertyDetails,
    nationalAddressMethod,
    setNationalAddressMethod: handleNationalAddressMethodChange,
    nationalAddressPhotoFiles,
    setNationalAddressPhotoFiles,
    nationalAddressLinkUrl,
    setNationalAddressLinkUrl,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
  };
}
