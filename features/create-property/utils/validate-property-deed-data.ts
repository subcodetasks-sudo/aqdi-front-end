import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import {
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsWaqfOwner,
  propertyDeedTypeNeedsFrontBack,
} from "@/features/create-property/types/deed-type";
import {
  isManualDeedEntryComplete,
  type ManualDeedEntryData,
} from "@/features/shared/types/manual-deed-entry";
import { propertyDeedTypeSupportsManualEntry } from "@/features/shared/utils/supports-manual-deed-entry";

export type PropertyDeedExistingImages = {
  instrument: string | null;
  front: string | null;
  back: string | null;
  inheritance: string | null;
  heirsPoa: string | null;
  endowmentCert: string | null;
  trusteeship: string | null;
  guardiansPoa: string | null;
};

export type PropertyDeedFilesState = {
  selectedDeedType: PropertyDeedTypeId | "";
  deedFiles: File[];
  deedFrontFiles: File[];
  deedBackFiles: File[];
  deedInheritanceFiles: File[];
  deedHeirsPoaFiles: File[];
  deedEndowmentCertFiles: File[];
  deedTrusteeshipFiles: File[];
  deedGuardiansPoaFiles: File[];
  isMultipleTrusteeshipDeedCopy: boolean;
  useManualDeedEntry: boolean;
  manualDeedEntry: ManualDeedEntryData;
  existingImages: PropertyDeedExistingImages;
};

function hasFileOrUrl(files: File[], url: string | null) {
  return files.length > 0 || Boolean(url);
}

function hasInstrumentData(state: PropertyDeedFilesState) {
  if (
    state.useManualDeedEntry &&
    propertyDeedTypeSupportsManualEntry(state.selectedDeedType)
  ) {
    return isManualDeedEntryComplete(state.manualDeedEntry);
  }

  if (propertyDeedTypeNeedsFrontBack(state.selectedDeedType)) {
    return (
      hasFileOrUrl(state.deedFrontFiles, state.existingImages.front) &&
      hasFileOrUrl(state.deedBackFiles, state.existingImages.back)
    );
  }

  return hasFileOrUrl(state.deedFiles, state.existingImages.instrument);
}

export function isPropertyDeedDataComplete(state: PropertyDeedFilesState) {
  if (state.selectedDeedType === "") {
    return false;
  }

  const {
    selectedDeedType,
    deedInheritanceFiles,
    deedHeirsPoaFiles,
    deedEndowmentCertFiles,
    deedTrusteeshipFiles,
    deedGuardiansPoaFiles,
    isMultipleTrusteeshipDeedCopy,
    existingImages,
  } = state;

  if (!hasInstrumentData(state)) {
    return false;
  }

  if (propertyDeedTypeIsDeceasedOwner(selectedDeedType)) {
    return (
      hasFileOrUrl(deedInheritanceFiles, existingImages.inheritance) &&
      hasFileOrUrl(deedHeirsPoaFiles, existingImages.heirsPoa)
    );
  }

  if (propertyDeedTypeIsWaqfOwner(selectedDeedType)) {
    return (
      hasFileOrUrl(deedEndowmentCertFiles, existingImages.endowmentCert) &&
      hasFileOrUrl(deedTrusteeshipFiles, existingImages.trusteeship) &&
      (!isMultipleTrusteeshipDeedCopy ||
        hasFileOrUrl(deedGuardiansPoaFiles, existingImages.guardiansPoa))
    );
  }

  return true;
}
