"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { submitContractStep2 } from "@/features/create-contract/services/submit-contract-step2";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import {
  DEFAULT_NATIONAL_ADDRESS_LOCATION,
  type NationalAddressMethodId,
} from "@/features/create-contract/types/national-address";
import type { AgentDataState } from "@/features/create-contract/types/owner-step";
import type { ManualNationalAddressData } from "@/features/shared/types/manual-national-address";
import { resolveSubmittedMapLocation } from "@/features/shared/utils/saudi-region-coordinates";

type SubmitContractStep2Input = {
  addressMethod: NationalAddressMethodId;
  photoFiles: File[];
  linkUrl: string;
  manualAddress: ManualNationalAddressData;
  legalAgent?: AgentDataState;
  hasExistingLegalAgentPoa?: boolean;
  waqfNazir?: AgentDataState;
  hasExistingWaqfNazirDocument?: boolean;
};

export function useSubmitContractStep2() {
  const t = useTranslations("createContract.deed");
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep1Data = useCreateContractDraftStore((state) => state.contractStep1Data);
  const isExistingPropertyContract = useCreateContractDraftStore(
    (state) => state.existingPropertyContext !== null,
  );
  const mapLocation =
    useCreateContractDraftStore((state) => state.deed.mapLocation) ??
    DEFAULT_NATIONAL_ADDRESS_LOCATION;
  const setContractStep2Data = useCreateContractDraftStore(
    (state) => state.setContractStep2Data,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitStep2({
    addressMethod,
    photoFiles,
    linkUrl,
    manualAddress,
    legalAgent,
    hasExistingLegalAgentPoa = false,
    waqfNazir,
  }: SubmitContractStep2Input): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    const contractId = contractSession?.contractId ?? contractStep1Data?.contract_id;

    if (!contractId) {
      toast.error(t("missingContractSession"));
      return false;
    }

    // Existing-property contracts already have the national address stored on
    // the backend from /contract/start, so allow continuing without re-uploading
    // a photo when the user hasn't picked a new one.
    if (
      isExistingPropertyContract &&
      addressMethod === "photo" &&
      photoFiles.length === 0 &&
      !legalAgent &&
      !waqfNazir
    ) {
      return true;
    }

    setIsSubmitting(true);

    const submittedLocation = resolveSubmittedMapLocation({
      addressMethod,
      propertyPlaceId: manualAddress.propertyPlaceId,
      mapLocation,
    });

    try {
      const result = await submitContractStep2({
        contractId,
        addressMethod,
        latitude: submittedLocation.lat,
        longitude: submittedLocation.lng,
        imageAddress: addressMethod === "photo" ? photoFiles[0] : undefined,
        addressUrl:
          addressMethod === "link" ? linkUrl.trim() || undefined : undefined,
        manualAddress: addressMethod === "manual" ? manualAddress : undefined,
        legalAgent: legalAgent
          ? {
              idNumber: legalAgent.idNumber,
              birthDate: legalAgent.birthDate,
              phone: legalAgent.phone,
            }
          : undefined,
        legalAgentPoaFile: legalAgent?.powerOfAttorneyFiles[0],
        hasExistingLegalAgentPoa,
        waqfNazir: waqfNazir
          ? {
              idNumber: waqfNazir.idNumber,
              birthDate: waqfNazir.birthDate,
              phone: waqfNazir.phone,
            }
          : undefined,
        waqfNazirDocumentFile: waqfNazir?.powerOfAttorneyFiles[0],
      });

      if (!result.ok) {
        toast.error(result.error || t("submitAddressError"));
        return false;
      }

      setContractStep2Data(result.data);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitStep2,
    isSubmitting,
  };
}
