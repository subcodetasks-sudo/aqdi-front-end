"use client";

import { DEED_STEP_PHASE_COUNT } from "@/features/create-contract/types/deed-type";
import { DEFAULT_NATIONAL_ADDRESS_LOCATION } from "@/features/create-contract/types/national-address";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

function canContinueNationalAddress(
  method: "map" | "photo" | "link",
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
  const deed = useCreateContractDraftStore((state) => state.deed);
  const setDeedPhaseIndex = useCreateContractDraftStore(
    (state) => state.setDeedPhaseIndex,
  );
  const setSelectedDeedType = useCreateContractDraftStore(
    (state) => state.setSelectedDeedType,
  );
  const setDeedFiles = useCreateContractDraftStore((state) => state.setDeedFiles);
  const setNationalAddressMethod = useCreateContractDraftStore(
    (state) => state.setNationalAddressMethod,
  );
  const setNationalAddressPhotoFiles = useCreateContractDraftStore(
    (state) => state.setNationalAddressPhotoFiles,
  );
  const setNationalAddressLinkUrl = useCreateContractDraftStore(
    (state) => state.setNationalAddressLinkUrl,
  );
  const setMapLocation = useCreateContractDraftStore((state) => state.setMapLocation);

  const isLastPhase = deed.currentPhaseIndex === DEED_STEP_PHASE_COUNT - 1;
  const canContinue =
    deed.currentPhaseIndex === 0
      ? deed.selectedDeedType !== "" && deed.deedFiles.length > 0
      : canContinueNationalAddress(
          deed.nationalAddressMethod,
          deed.nationalAddressPhotoFiles,
          deed.nationalAddressLinkUrl,
        );

  function goToNextPhase() {
    if (deed.currentPhaseIndex < DEED_STEP_PHASE_COUNT - 1) {
      setDeedPhaseIndex(deed.currentPhaseIndex + 1);
    }
  }

  function goToPreviousPhase() {
    if (deed.currentPhaseIndex > 0) {
      setDeedPhaseIndex(deed.currentPhaseIndex - 1);
    }
  }

  return {
    currentPhaseIndex: deed.currentPhaseIndex,
    selectedDeedType: deed.selectedDeedType,
    setSelectedDeedType,
    deedFiles: deed.deedFiles,
    setDeedFiles,
    nationalAddressMethod: deed.nationalAddressMethod,
    setNationalAddressMethod,
    nationalAddressPhotoFiles: deed.nationalAddressPhotoFiles,
    setNationalAddressPhotoFiles,
    nationalAddressLinkUrl: deed.nationalAddressLinkUrl,
    setNationalAddressLinkUrl,
    mapLocation: deed.mapLocation ?? DEFAULT_NATIONAL_ADDRESS_LOCATION,
    setMapLocation,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
  };
}
