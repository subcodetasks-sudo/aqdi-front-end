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

  const ownerComplete = isOwnerDataComplete(owner.ownerData);
  const agentComplete =
    owner.ownerData.hasAgent !== "yes" || isAgentDataComplete(owner.agentData);
  const canContinue = ownerComplete && agentComplete;

  return {
    ownerData: owner.ownerData,
    setOwnerData,
    agentData: owner.agentData,
    setAgentData,
    canContinue,
  };
}
