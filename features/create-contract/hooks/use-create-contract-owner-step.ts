"use client";

import { useEffect } from "react";

import {
  isAgentDataComplete,
  isOwnerDataComplete,
} from "@/features/create-contract/types/owner-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import { resolveContractAssetUrl } from "@/features/create-contract/utils/build-existing-contract-draft";
import { isLegalAgentDataComplete } from "@/features/create-contract/utils/is-legal-agent-data-complete";
import { requiresDeceasedOwnerLegalAgent } from "@/features/create-contract/utils/requires-deceased-owner-legal-agent";

export function useCreateContractOwnerStep() {
  const owner = useCreateContractDraftStore((state) => state.owner);
  const setOwnerData = useCreateContractDraftStore((state) => state.setOwnerData);
  const setAgentData = useCreateContractDraftStore((state) => state.setAgentData);
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const deedOwnerIsDeceased = useCreateContractDraftStore(
    (state) => state.deed.deedOwnerIsDeceased,
  );
  const contractStep1Data = useCreateContractDraftStore(
    (state) => state.contractStep1Data,
  );
  const contractStep2Data = useCreateContractDraftStore(
    (state) => state.contractStep2Data,
  );
  const deedHeirsPoaFiles = useCreateContractDraftStore(
    (state) => state.deed.deedHeirsPoaFiles,
  );
  const deedInheritanceFiles = useCreateContractDraftStore(
    (state) => state.deed.deedInheritanceFiles,
  );

  const agentOnly = requiresDeceasedOwnerLegalAgent({
    selectedDeedType,
    instrumentType: contractStep1Data?.instrument_type,
    instrumentTypeTrans: contractStep1Data?.instrument_type_trans,
    deedOwnerIsDeceased,
    requiresDeceasedOwnerLegalAgent:
      contractStep2Data?.requires_deceased_owner_legal_agent ??
      contractStep1Data?.requires_deceased_owner_legal_agent,
    propertyOwnerIsDeceased:
      contractStep2Data?.property_owner_is_deceased ??
      contractStep1Data?.property_owner_is_deceased,
    hasDeceasedDeedAttachments:
      deedHeirsPoaFiles.length > 0 ||
      deedInheritanceFiles.length > 0 ||
      Boolean(contractStep1Data?.Image_inheritance_certificate) ||
      Boolean(contractStep1Data?.copy_power_of_attorney_from_heirs_to_agent),
  });

  const existingLegalAgentPoaUrl = resolveContractAssetUrl(
    contractStep2Data?.copy_of_the_authorization_or_agency,
  );
  const documentAlreadyAttached =
    Boolean(existingLegalAgentPoaUrl) ||
    Boolean(contractStep1Data?.copy_power_of_attorney_from_heirs_to_agent) ||
    deedHeirsPoaFiles.length > 0;

  useEffect(() => {
    if (!agentOnly) {
      return;
    }

    const current = useCreateContractDraftStore.getState().owner.ownerData;
    if (current.hasAgent === "yes") {
      return;
    }

    setOwnerData({ ...current, hasAgent: "yes" });
  }, [agentOnly, setOwnerData]);

  const ownerComplete = agentOnly || isOwnerDataComplete(owner.ownerData);
  const needsAgent = agentOnly || owner.ownerData.hasAgent === "yes";
  const agentComplete =
    !needsAgent ||
    (agentOnly
      ? isLegalAgentDataComplete(owner.agentData, {
          hasExistingPoa: documentAlreadyAttached,
        })
      : isAgentDataComplete(owner.agentData));
  const canContinue = ownerComplete && agentComplete;

  return {
    ownerData: owner.ownerData,
    setOwnerData,
    agentData: owner.agentData,
    setAgentData,
    canContinue,
    agentOnly,
    existingLegalAgentPoaUrl,
    documentAlreadyAttached,
  };
}
