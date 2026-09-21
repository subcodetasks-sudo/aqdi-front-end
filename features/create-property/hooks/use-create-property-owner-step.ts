"use client";

import { useEffect } from "react";

import {
  isPropertyAgentDataComplete,
  isPropertyOwnerDataComplete,
} from "@/features/create-property/types/owner-step";
import {
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsWaqfOwner,
} from "@/features/create-property/types/deed-type";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertyOwnerStep() {
  const ownerData = useCreatePropertyDraftStore((state) => state.ownerData);
  const agentData = useCreatePropertyDraftStore((state) => state.agentData);
  const selectedDeedType = useCreatePropertyDraftStore(
    (state) => state.selectedDeedType,
  );
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
  // Deceased → legal agent; endowment → nazir. Both use agent API fields.
  const agentOnly =
    propertyDeedTypeIsDeceasedOwner(selectedDeedType) ||
    propertyDeedTypeIsWaqfOwner(selectedDeedType);
  const isWaqfNazir = propertyDeedTypeIsWaqfOwner(selectedDeedType);

  useEffect(() => {
    if (!agentOnly) {
      return;
    }

    const current = useCreatePropertyDraftStore.getState().ownerData;
    if (current.hasAgent === "yes") {
      return;
    }

    setOwnerData({ ...current, hasAgent: "yes" });
  }, [agentOnly, setOwnerData]);

  const ownerComplete = agentOnly || isPropertyOwnerDataComplete(ownerData);
  const needsAgent = agentOnly || ownerData.hasAgent === "yes";
  const agentComplete =
    !needsAgent ||
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
    agentOnly,
    isWaqfNazir,
    hasExistingPowerOfAttorney: isEditMode && hasExistingPowerOfAttorney,
    existingPowerOfAttorneyImageUrl:
      isEditMode && hasExistingPowerOfAttorney
        ? existingPowerOfAttorneyImageUrl
        : null,
    clearExistingPowerOfAttorneyImageUrl: () =>
      clearExistingFileUrl("existingPowerOfAttorneyImageUrl"),
  };
}
