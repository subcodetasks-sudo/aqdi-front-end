"use client";

import {
  isPropertyAgentDataComplete,
  isPropertyOwnerDataComplete,
} from "@/features/create-property/types/owner-step";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertyOwnerStep() {
  const ownerData = useCreatePropertyDraftStore((state) => state.ownerData);
  const agentData = useCreatePropertyDraftStore((state) => state.agentData);
  const isEditMode = useCreatePropertyDraftStore((state) => state.isEditMode);
  const hasExistingPowerOfAttorney = useCreatePropertyDraftStore(
    (state) => state.hasExistingPowerOfAttorney,
  );
  const existingPowerOfAttorneyImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingPowerOfAttorneyImageUrl,
  );
  const setOwnerData = useCreatePropertyDraftStore((state) => state.setOwnerData);
  const setAgentData = useCreatePropertyDraftStore((state) => state.setAgentData);
  const clearExistingFileUrl = useCreatePropertyDraftStore(
    (state) => state.clearExistingFileUrl,
  );

  const ownerComplete = isPropertyOwnerDataComplete(ownerData);
  const agentComplete =
    ownerData.hasAgent !== "yes" ||
    isPropertyAgentDataComplete(agentData, {
      allowExistingPowerOfAttorney: isEditMode && hasExistingPowerOfAttorney,
    });
  const canContinue = ownerComplete && agentComplete;

  return {
    ownerData,
    setOwnerData,
    agentData,
    setAgentData,
    canContinue,
    hasExistingPowerOfAttorney: isEditMode && hasExistingPowerOfAttorney,
    existingPowerOfAttorneyImageUrl:
      isEditMode && hasExistingPowerOfAttorney
        ? existingPowerOfAttorneyImageUrl
        : null,
    clearExistingPowerOfAttorneyImageUrl: () =>
      clearExistingFileUrl("existingPowerOfAttorneyImageUrl"),
  };
}
