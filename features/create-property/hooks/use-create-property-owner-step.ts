"use client";

import {
  getPropertyOwnerStepPhaseCount,
  isPropertyAgentDataComplete,
  isPropertyOwnerDataComplete,
} from "@/features/create-property/types/owner-step";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertyOwnerStep() {
  const ownerPhaseIndex = useCreatePropertyDraftStore(
    (state) => state.ownerPhaseIndex,
  );
  const ownerData = useCreatePropertyDraftStore((state) => state.ownerData);
  const agentData = useCreatePropertyDraftStore((state) => state.agentData);
  const setOwnerPhaseIndex = useCreatePropertyDraftStore(
    (state) => state.setOwnerPhaseIndex,
  );
  const setOwnerData = useCreatePropertyDraftStore((state) => state.setOwnerData);
  const setAgentData = useCreatePropertyDraftStore((state) => state.setAgentData);

  const phaseCount = getPropertyOwnerStepPhaseCount(ownerData.hasAgent);
  const isLastPhase =
    ownerPhaseIndex === phaseCount - 1 ||
    (ownerPhaseIndex === 0 && ownerData.hasAgent === "no");

  const canContinue =
    ownerPhaseIndex === 0
      ? isPropertyOwnerDataComplete(ownerData)
      : isPropertyAgentDataComplete(agentData);

  function goToNextPhase() {
    if (ownerPhaseIndex < phaseCount - 1) {
      setOwnerPhaseIndex(ownerPhaseIndex + 1);
    }
  }

  function goToPreviousPhase() {
    if (ownerPhaseIndex > 0) {
      setOwnerPhaseIndex(ownerPhaseIndex - 1);
    }
  }

  return {
    currentPhaseIndex: ownerPhaseIndex,
    ownerData,
    setOwnerData,
    agentData,
    setAgentData,
    phaseCount,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
  };
}
