"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { submitContractStep1 } from "@/features/create-contract/services/submit-contract-step1";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import { deedTypeIsLeaseRenewal } from "@/features/create-contract/types/deed-type";
import { mapDeedTypeToInstrumentType } from "@/features/create-contract/utils/map-deed-type-to-instrument-type";
import { isManualDeedEntryComplete } from "@/features/shared/types/manual-deed-entry";
import type { ManualDeedEntryData } from "@/features/shared/types/manual-deed-entry";

export function useSubmitContractStep1() {
  const t = useTranslations("createContract.deed");
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep1Data = useCreateContractDraftStore((state) => state.contractStep1Data);
  const isExistingPropertyContract = useCreateContractDraftStore(
    (state) => state.existingPropertyContext !== null,
  );
  const setContractStep1Data = useCreateContractDraftStore(
    (state) => state.setContractStep1Data,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitStep1(
    selectedDeedType: DeedTypeId,
    files: {
      instrument?: File;
      front?: File;
      back?: File;
      inheritance?: File;
      heirsPoa?: File;
      endowmentCert?: File;
      trusteeship?: File;
      isMultipleTrusteeshipDeedCopy?: boolean;
      guardiansPoa?: File;
      manualDeedEntry?: ManualDeedEntryData;
    },
  ): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    if (!contractSession) {
      toast.error(t("missingContractSession"));
      return false;
    }

    const hasManualEntry = Boolean(
      files.manualDeedEntry && isManualDeedEntryComplete(files.manualDeedEntry),
    );
    const hasNewFile = Boolean(
      files.instrument ||
        files.front ||
        files.back ||
        files.inheritance ||
        files.heirsPoa ||
        files.endowmentCert ||
        files.trusteeship ||
        files.guardiansPoa ||
        hasManualEntry,
    );
    const isLeaseRenewal = deedTypeIsLeaseRenewal(selectedDeedType);

    if (!hasNewFile && !isLeaseRenewal) {
      // Existing-property contracts already have the deed data stored on the
      // backend from /contract/start, so allow continuing without re-uploading.
      return isExistingPropertyContract;
    }

    const instrumentType = mapDeedTypeToInstrumentType(selectedDeedType);
    const minSubmittedStep = isLeaseRenewal ? 4 : 2;

    if (
      contractStep1Data &&
      contractStep1Data.instrument_type === instrumentType &&
      contractStep1Data.step >= minSubmittedStep
    ) {
      return true;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContractStep1({
        contractId: contractSession.contractId,
        instrumentType,
        imageInstrument: files.instrument,
        imageInstrumentFront: files.front,
        imageInstrumentBack: files.back,
        imageInheritanceCertificate: files.inheritance,
        copyPowerOfAttorneyFromHeirsToAgent: files.heirsPoa,
        copyOfTheEndowmentRegistrationCertificate: files.endowmentCert,
        copyOfTheTrusteeshipDeed: files.trusteeship,
        isMultipleTrusteeshipDeedCopy: files.isMultipleTrusteeshipDeedCopy,
        copyOfGuardiansPowerOfAttorneyForAgent: files.guardiansPoa,
        manualDeedEntry: hasManualEntry ? files.manualDeedEntry : undefined,
      });

      if (!result.ok) {
        toast.error(result.error || t("submitError"));
        return false;
      }

      setContractStep1Data(result.data);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitStep1,
    isSubmitting,
  };
}
