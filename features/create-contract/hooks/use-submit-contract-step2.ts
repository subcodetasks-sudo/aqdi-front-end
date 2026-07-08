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

type SubmitContractStep2Input = {
  addressMethod: NationalAddressMethodId;
  photoFiles: File[];
  linkUrl: string;
};

export function useSubmitContractStep2() {
  const t = useTranslations("createContract.deed");
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep1Data = useCreateContractDraftStore((state) => state.contractStep1Data);
  const contractStep2Data = useCreateContractDraftStore((state) => state.contractStep2Data);
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
  }: SubmitContractStep2Input): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    const contractId = contractSession?.contractId ?? contractStep1Data?.contract_id;

    if (!contractId) {
      toast.error(t("missingContractSession"));
      return false;
    }

    if (contractStep2Data && contractStep2Data.step >= 3) {
      return true;
    }

    // Existing-property contracts already have the national address stored on
    // the backend from /contract/start, so allow continuing without re-uploading
    // a photo when the user hasn't picked a new one.
    if (
      isExistingPropertyContract &&
      addressMethod === "photo" &&
      photoFiles.length === 0
    ) {
      return true;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContractStep2({
        contractId,
        addressMethod,
        latitude: mapLocation.lat,
        longitude: mapLocation.lng,
        imageAddress: addressMethod === "photo" ? photoFiles[0] : undefined,
        addressUrl:
          addressMethod === "link" ? linkUrl.trim() || undefined : undefined,
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
