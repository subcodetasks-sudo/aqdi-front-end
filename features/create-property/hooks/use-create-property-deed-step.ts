"use client";

import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import {
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsWaqfOwner,
  propertyDeedTypeNeedsFrontBack,
} from "@/features/create-property/types/deed-type";
import { isPropertyDeedDataComplete } from "@/features/create-property/utils/validate-property-deed-data";

export function useCreatePropertyDeedStep() {
  const selectedDeedType = useCreatePropertyDraftStore(
    (state) => state.selectedDeedType,
  );
  const deedFiles = useCreatePropertyDraftStore((state) => state.deedFiles);
  const deedFrontFiles = useCreatePropertyDraftStore((state) => state.deedFrontFiles);
  const deedBackFiles = useCreatePropertyDraftStore((state) => state.deedBackFiles);
  const deedInheritanceFiles = useCreatePropertyDraftStore(
    (state) => state.deedInheritanceFiles,
  );
  const deedHeirsPoaFiles = useCreatePropertyDraftStore(
    (state) => state.deedHeirsPoaFiles,
  );
  const deedEndowmentCertFiles = useCreatePropertyDraftStore(
    (state) => state.deedEndowmentCertFiles,
  );
  const deedTrusteeshipFiles = useCreatePropertyDraftStore(
    (state) => state.deedTrusteeshipFiles,
  );
  const isMultipleTrusteeshipDeedCopy = useCreatePropertyDraftStore(
    (state) => state.isMultipleTrusteeshipDeedCopy,
  );
  const deedGuardiansPoaFiles = useCreatePropertyDraftStore(
    (state) => state.deedGuardiansPoaFiles,
  );
  const existingDeedImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingDeedImageUrl,
  );
  const existingDeedFrontImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingDeedFrontImageUrl,
  );
  const existingDeedBackImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingDeedBackImageUrl,
  );
  const existingInheritanceImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingInheritanceImageUrl,
  );
  const existingHeirsPoaImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingHeirsPoaImageUrl,
  );
  const existingEndowmentCertImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingEndowmentCertImageUrl,
  );
  const existingTrusteeshipImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingTrusteeshipImageUrl,
  );
  const existingGuardiansPoaImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingGuardiansPoaImageUrl,
  );
  const setSelectedDeedType = useCreatePropertyDraftStore(
    (state) => state.setSelectedDeedType,
  );
  const setDeedFiles = useCreatePropertyDraftStore((state) => state.setDeedFiles);
  const setDeedFrontFiles = useCreatePropertyDraftStore(
    (state) => state.setDeedFrontFiles,
  );
  const setDeedBackFiles = useCreatePropertyDraftStore((state) => state.setDeedBackFiles);
  const setDeedInheritanceFiles = useCreatePropertyDraftStore(
    (state) => state.setDeedInheritanceFiles,
  );
  const setDeedHeirsPoaFiles = useCreatePropertyDraftStore(
    (state) => state.setDeedHeirsPoaFiles,
  );
  const setDeedEndowmentCertFiles = useCreatePropertyDraftStore(
    (state) => state.setDeedEndowmentCertFiles,
  );
  const setDeedTrusteeshipFiles = useCreatePropertyDraftStore(
    (state) => state.setDeedTrusteeshipFiles,
  );
  const setIsMultipleTrusteeshipDeedCopy = useCreatePropertyDraftStore(
    (state) => state.setIsMultipleTrusteeshipDeedCopy,
  );
  const setDeedGuardiansPoaFiles = useCreatePropertyDraftStore(
    (state) => state.setDeedGuardiansPoaFiles,
  );
  const useManualDeedEntry = useCreatePropertyDraftStore(
    (state) => state.useManualDeedEntry,
  );
  const manualDeedEntry = useCreatePropertyDraftStore((state) => state.manualDeedEntry);
  const setUseManualDeedEntry = useCreatePropertyDraftStore(
    (state) => state.setUseManualDeedEntry,
  );
  const setManualDeedEntry = useCreatePropertyDraftStore(
    (state) => state.setManualDeedEntry,
  );

  const needsFrontBack = propertyDeedTypeNeedsFrontBack(selectedDeedType);
  const isDeceasedOwner = propertyDeedTypeIsDeceasedOwner(selectedDeedType);
  const isWaqfOwner = propertyDeedTypeIsWaqfOwner(selectedDeedType);

  const canContinue = isPropertyDeedDataComplete({
    selectedDeedType,
    deedFiles,
    deedFrontFiles,
    deedBackFiles,
    deedInheritanceFiles,
    deedHeirsPoaFiles,
    deedEndowmentCertFiles,
    deedTrusteeshipFiles,
    deedGuardiansPoaFiles,
    isMultipleTrusteeshipDeedCopy,
    useManualDeedEntry,
    manualDeedEntry,
    existingImages: {
      instrument: existingDeedImageUrl,
      front: existingDeedFrontImageUrl,
      back: existingDeedBackImageUrl,
      inheritance: existingInheritanceImageUrl,
      heirsPoa: existingHeirsPoaImageUrl,
      endowmentCert: existingEndowmentCertImageUrl,
      trusteeship: existingTrusteeshipImageUrl,
      guardiansPoa: existingGuardiansPoaImageUrl,
    },
  });

  return {
    selectedDeedType,
    setSelectedDeedType,
    deedFiles,
    setDeedFiles,
    deedFrontFiles,
    setDeedFrontFiles,
    deedBackFiles,
    setDeedBackFiles,
    deedInheritanceFiles,
    setDeedInheritanceFiles,
    deedHeirsPoaFiles,
    setDeedHeirsPoaFiles,
    deedEndowmentCertFiles,
    setDeedEndowmentCertFiles,
    deedTrusteeshipFiles,
    setDeedTrusteeshipFiles,
    isMultipleTrusteeshipDeedCopy,
    setIsMultipleTrusteeshipDeedCopy,
    deedGuardiansPoaFiles,
    setDeedGuardiansPoaFiles,
    useManualDeedEntry,
    setUseManualDeedEntry,
    manualDeedEntry,
    setManualDeedEntry,
    needsFrontBack,
    isDeceasedOwner,
    isWaqfOwner,
    existingDeedImageUrl,
    existingDeedFrontImageUrl,
    existingDeedBackImageUrl,
    existingInheritanceImageUrl,
    existingHeirsPoaImageUrl,
    existingEndowmentCertImageUrl,
    existingTrusteeshipImageUrl,
    existingGuardiansPoaImageUrl,
    canContinue,
  };
}
