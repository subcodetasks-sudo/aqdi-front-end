"use client";

import { useState } from "react";

import {
  EMPTY_PROPERTY_AGENT_DATA,
  EMPTY_PROPERTY_OWNER_DATA,
  getPropertyOwnerStepPhaseCount,
  isPropertyAgentDataComplete,
  isPropertyOwnerDataComplete,
  type PropertyAgentDataState,
  type PropertyOwnerDataState,
} from "@/features/create-property/types/owner-step";

export function useCreatePropertyOwnerStep() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [ownerData, setOwnerData] = useState<PropertyOwnerDataState>(
    EMPTY_PROPERTY_OWNER_DATA,
  );
  const [agentData, setAgentData] = useState<PropertyAgentDataState>(
    EMPTY_PROPERTY_AGENT_DATA,
  );

  const phaseCount = getPropertyOwnerStepPhaseCount(ownerData.hasAgent);
  const isLastPhase =
    currentPhaseIndex === phaseCount - 1 ||
    (currentPhaseIndex === 0 && ownerData.hasAgent === "no");

  const canContinue =
    currentPhaseIndex === 0
      ? isPropertyOwnerDataComplete(ownerData)
      : isPropertyAgentDataComplete(agentData);

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

  function updateOwnerData(value: PropertyOwnerDataState) {
    if (value.hasAgent === "no" && ownerData.hasAgent === "yes") {
      setAgentData(EMPTY_PROPERTY_AGENT_DATA);
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
