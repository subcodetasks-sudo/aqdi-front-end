"use client";

import {
  canContinueNationalAddress,
  type PropertyNationalAddressMethodId,
} from "@/features/create-property/types/national-address";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertyAddressStep() {
  const method = useCreatePropertyDraftStore((state) => state.addressMethod);
  const photoFiles = useCreatePropertyDraftStore((state) => state.addressPhotoFiles);
  const linkUrl = useCreatePropertyDraftStore((state) => state.addressLinkUrl);
  const mapLocation = useCreatePropertyDraftStore((state) => state.mapLocation);
  const setAddressMethod = useCreatePropertyDraftStore(
    (state) => state.setAddressMethod,
  );
  const setAddressPhotoFiles = useCreatePropertyDraftStore(
    (state) => state.setAddressPhotoFiles,
  );
  const setAddressLinkUrl = useCreatePropertyDraftStore(
    (state) => state.setAddressLinkUrl,
  );
  const setMapLocation = useCreatePropertyDraftStore((state) => state.setMapLocation);

  const canContinue = canContinueNationalAddress(method, photoFiles, linkUrl);

  function handleMethodChange(nextMethod: PropertyNationalAddressMethodId) {
    setAddressMethod(nextMethod);
  }

  return {
    method,
    setMethod: handleMethodChange,
    photoFiles,
    setPhotoFiles: setAddressPhotoFiles,
    linkUrl,
    setLinkUrl: setAddressLinkUrl,
    mapLocation,
    setMapLocation,
    canContinue,
  };
}
