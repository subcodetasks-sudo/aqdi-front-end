"use client";

import { useState } from "react";

import {
  EMPTY_AGENT_DATA,
  EMPTY_OWNER_DATA,
  getOwnerStepPhaseCount,
  isAgentDataComplete,
  isOwnerDataComplete,
  type AgentDataState,
  type OwnerDataState,
} from "@/features/create-contract/types/owner-step";

export function useCreateContractOwnerStep() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [ownerData, setOwnerData] = useState<OwnerDataState>(EMPTY_OWNER_DATA);
  const [agentData, setAgentData] = useState<AgentDataState>(EMPTY_AGENT_DATA);

  const phaseCount = getOwnerStepPhaseCount(ownerData.hasAgent);
  const isLastPhase =
    currentPhaseIndex === phaseCount - 1 ||
    (currentPhaseIndex === 0 && ownerData.hasAgent === "no");

  const canContinue =
    currentPhaseIndex === 0
      ? isOwnerDataComplete(ownerData)
      : isAgentDataComplete(agentData);

  function goToNextPhase() {
    if (currentPhaseIndex < phaseCount - 1) {
      setCurrentPhaseIndex((phase) => phase + 1);
    }
  }

  function goToPreviousPhase() {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex((phase) => phase - 1);
    }
  }

  function updateOwnerData(value: OwnerDataState) {
    if (value.hasAgent === "no" && ownerData.hasAgent === "yes") {
      setAgentData(EMPTY_AGENT_DATA);
    }

    setOwnerData(value);
  }

  return {
    currentPhaseIndex,
    ownerData,
    setOwnerData: updateOwnerData,
    agentData,
    setAgentData,
    phaseCount,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
  };
}
