import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import {
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsWaqfOwner,
  propertyDeedTypeNeedsFrontBack,
} from "@/features/create-property/types/deed-type";

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
  existingImages: PropertyDeedExistingImages;
};

function hasFileOrUrl(files: File[], url: string | null) {
  return files.length > 0 || Boolean(url);
}

export function isPropertyDeedDataComplete(state: PropertyDeedFilesState) {
  if (state.selectedDeedType === "") {
    return false;
  }

  const {
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
    existingImages,
  } = state;

  if (propertyDeedTypeNeedsFrontBack(selectedDeedType)) {
    return (
      hasFileOrUrl(deedFrontFiles, existingImages.front) &&
      hasFileOrUrl(deedBackFiles, existingImages.back)
    );
  }

  if (propertyDeedTypeIsDeceasedOwner(selectedDeedType)) {
    return (
      hasFileOrUrl(deedFiles, existingImages.instrument) &&
      hasFileOrUrl(deedInheritanceFiles, existingImages.inheritance) &&
      hasFileOrUrl(deedHeirsPoaFiles, existingImages.heirsPoa)
    );
  }

  if (propertyDeedTypeIsWaqfOwner(selectedDeedType)) {
    return (
      hasFileOrUrl(deedFiles, existingImages.instrument) &&
      hasFileOrUrl(deedEndowmentCertFiles, existingImages.endowmentCert) &&
      hasFileOrUrl(deedTrusteeshipFiles, existingImages.trusteeship) &&
      (!isMultipleTrusteeshipDeedCopy ||
        hasFileOrUrl(deedGuardiansPoaFiles, existingImages.guardiansPoa))
    );
  }

  return hasFileOrUrl(deedFiles, existingImages.instrument);
}
