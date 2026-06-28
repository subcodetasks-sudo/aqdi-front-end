"use client";

import { useState } from "react";

import { submitPropertyStep1 } from "@/features/create-property/services/submit-property-step1";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import { toPropertyContractType } from "@/features/create-property/utils/contract-type";
import type { PropertyTypeId } from "@/features/properties/types/property-type";

export function useSubmitPropertyStep1(propertyType: PropertyTypeId) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedDeedType = useCreatePropertyDraftStore(
    (state) => state.selectedDeedType,
  );
  const deedFiles = useCreatePropertyDraftStore((state) => state.deedFiles);
  const addressMethod = useCreatePropertyDraftStore((state) => state.addressMethod);
  const addressPhotoFiles = useCreatePropertyDraftStore(
    (state) => state.addressPhotoFiles,
  );
  const addressLinkUrl = useCreatePropertyDraftStore((state) => state.addressLinkUrl);
  const mapLocation = useCreatePropertyDraftStore((state) => state.mapLocation);
  const propertyId = useCreatePropertyDraftStore((state) => state.propertyId);
  const setPropertyId = useCreatePropertyDraftStore((state) => state.setPropertyId);

  async function submitStep1() {
    if (selectedDeedType === "" || deedFiles.length === 0) {
      return {
        ok: false as const,
        error: "Deed data is incomplete",
      };
    }

    setIsSubmitting(true);

    try {
      const result = await submitPropertyStep1({
        contractType: toPropertyContractType(propertyType),
        instrumentType: selectedDeedType,
        imageInstrument: deedFiles[0],
        addressMethod,
        imageAddress: addressPhotoFiles[0],
        addressUrl: addressLinkUrl.trim() || undefined,
        latitude: mapLocation.lat,
        longitude: mapLocation.lng,
      });

      if (!result.ok) {
        return result;
      }

      setPropertyId(result.propertyId);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    propertyId,
    isSubmitting,
    submitStep1,
  };
}
