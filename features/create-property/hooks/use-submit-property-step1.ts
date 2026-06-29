"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { submitPropertyStep1 } from "@/features/create-property/services/submit-property-step1";
import { updatePropertyStep1 } from "@/features/create-property/services/update-property-step1";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import { parsePropertyId } from "@/features/create-property/utils/parse-property-id";

export function useSubmitPropertyStep1() {
  const searchParams = useSearchParams();
  const urlPropertyId = parsePropertyId(searchParams.get("propertyId") ?? undefined);
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
  const existingDeedImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingDeedImageUrl,
  );
  const setPropertyId = useCreatePropertyDraftStore((state) => state.setPropertyId);
  const isEditMode = urlPropertyId !== null;
  const editPropertyId = urlPropertyId ?? propertyId;

  async function submitStep1() {
    const hasDeedImage = deedFiles.length === 1 || Boolean(existingDeedImageUrl);

    if (selectedDeedType === "" || !hasDeedImage) {
      return {
        ok: false as const,
        error: "Deed data is incomplete",
      };
    }

    if (isEditMode && !editPropertyId) {
      return {
        ok: false as const,
        error: "Property ID is missing",
      };
    }

    setIsSubmitting(true);

    try {
      const payload = {
        instrumentType: selectedDeedType,
        imageInstrument: deedFiles[0],
        addressMethod,
        imageAddress: addressPhotoFiles[0],
        addressUrl: addressLinkUrl.trim() || undefined,
        latitude: mapLocation.lat,
        longitude: mapLocation.lng,
      };

      const result =
        isEditMode && editPropertyId
          ? await updatePropertyStep1({
              ...payload,
              propertyId: editPropertyId,
            })
          : await submitPropertyStep1({
              ...payload,
              imageInstrument: payload.imageInstrument!,
            });

      if (!result.ok) {
        return result;
      }

      setPropertyId(isEditMode ? editPropertyId : result.propertyId);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    propertyId: editPropertyId,
    isSubmitting,
    submitStep1,
  };
}
