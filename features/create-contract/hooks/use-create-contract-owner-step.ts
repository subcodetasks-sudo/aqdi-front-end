"use client";

import {
  isAgentDataComplete,
  isOwnerDataComplete,
} from "@/features/create-contract/types/owner-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useCreateContractOwnerStep() {
  const owner = useCreateContractDraftStore((state) => state.owner);
  const setOwnerData = useCreateContractDraftStore((state) => state.setOwnerData);
  const setAgentData = useCreateContractDraftStore((state) => state.setAgentData);

  const needsAgent = owner.ownerData.hasAgent === "yes";
  const agentComplete = !needsAgent || isAgentDataComplete(owner.agentData);
  const canContinue = isOwnerDataComplete(owner.ownerData) && agentComplete;

  return {
    ownerData: owner.ownerData,
    setOwnerData,
    agentData: owner.agentData,
    setAgentData,
    canContinue,
  };
}
