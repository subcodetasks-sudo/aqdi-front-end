"use client";

import {
  getOwnerStepPhaseCount,
  isAgentDataComplete,
  isOwnerDataComplete,
} from "@/features/create-contract/types/owner-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useCreateContractOwnerStep() {
  const owner = useCreateContractDraftStore((state) => state.owner);
  const setOwnerPhaseIndex = useCreateContractDraftStore(
    (state) => state.setOwnerPhaseIndex,
  );
  const setOwnerData = useCreateContractDraftStore((state) => state.setOwnerData);
  const setAgentData = useCreateContractDraftStore((state) => state.setAgentData);

  const phaseCount = getOwnerStepPhaseCount(owner.ownerData.hasAgent);
  const isLastPhase =
    owner.currentPhaseIndex === phaseCount - 1 ||
    (owner.currentPhaseIndex === 0 && owner.ownerData.hasAgent === "no");

  const canContinue =
    owner.currentPhaseIndex === 0
      ? isOwnerDataComplete(owner.ownerData)
      : isAgentDataComplete(owner.agentData);

  function goToNextPhase() {
    if (owner.currentPhaseIndex < phaseCount - 1) {
      setOwnerPhaseIndex(owner.currentPhaseIndex + 1);
    }
  }

  function goToPreviousPhase() {
    if (owner.currentPhaseIndex > 0) {
      setOwnerPhaseIndex(owner.currentPhaseIndex - 1);
    }
  }

  return {
    currentPhaseIndex: owner.currentPhaseIndex,
    ownerData: owner.ownerData,
    setOwnerData,
    agentData: owner.agentData,
    setAgentData,
    phaseCount,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
  };
}
