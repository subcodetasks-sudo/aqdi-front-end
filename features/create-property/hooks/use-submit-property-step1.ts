"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import {
  propertyDeedTypeIsAdversePossession,
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsWaqfOwner,
  propertyDeedTypeNeedsFrontBack,
} from "@/features/create-property/types/deed-type";
import {
  isPropertyDetailsComplete,
  isStrongArgumentDetailsComplete,
} from "@/features/create-property/types/property-details";
import { appendPropertyStep1Fields } from "@/features/create-property/utils/build-property-step1-form-data";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { mapPropertyDeedTypeToApiInstrumentType } from "@/features/create-property/utils/map-property-deed-type-to-api";
import { parsePropertyId } from "@/features/create-property/utils/parse-property-id";
import { resolveDraftFile } from "@/features/create-property/utils/resolve-draft-file";
import { resolveUploadFile } from "@/features/create-property/utils/resolve-upload-file";
import { isPropertyDeedDataComplete } from "@/features/create-property/utils/validate-property-deed-data";

type Step1SubmitResult =
  | { ok: true; propertyId: number; message?: string }
  | { ok: false; error: string };

async function postPropertyStep1FormData(
  endpoint: "/api/realstate/step1" | "/api/realstate/step1/update",
  formData: FormData,
): Promise<Step1SubmitResult> {
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as Step1SubmitResult | null;

  if (!data || typeof data !== "object") {
    return {
      ok: false,
      error: "Something went wrong",
    };
  }

  if (!data.ok) {
    return {
      ok: false,
      error: data.error || "Something went wrong",
    };
  }

  return data;
}

export function useSubmitPropertyStep1(
  contractType: PropertyContractType = "housing",
) {
  const searchParams = useSearchParams();
  const urlPropertyId = parsePropertyId(searchParams.get("propertyId") ?? undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setPropertyId = useCreatePropertyDraftStore((state) => state.setPropertyId);
  const storePropertyId = useCreatePropertyDraftStore((state) => state.propertyId);
  const propertyId = urlPropertyId ?? storePropertyId;
  // Any known property id must hit update (edit URL, or resubmit after create).
  const shouldUpdate = propertyId !== null;

  async function submitStep1() {
    // Read at submit time so we never race async file-persist setters.
    const state = useCreatePropertyDraftStore.getState();
    const {
      selectedDeedType,
      propertyDetails,
      deedFiles,
      deedPersistedFiles,
      deedFrontFiles,
      deedFrontPersistedFiles,
      deedBackFiles,
      deedBackPersistedFiles,
      deedInheritanceFiles,
      deedInheritancePersistedFiles,
      deedHeirsPoaFiles,
      deedHeirsPoaPersistedFiles,
      deedEndowmentCertFiles,
      deedEndowmentCertPersistedFiles,
      deedTrusteeshipFiles,
      deedTrusteeshipPersistedFiles,
      deedGuardiansPoaFiles,
      deedGuardiansPoaPersistedFiles,
      isMultipleTrusteeshipDeedCopy,
      hasMinorHeirs,
      useManualDeedEntry,
      manualDeedEntry,
      addressMethod,
      addressPhotoFiles,
      addressPhotoPersistedFiles,
      addressLinkUrl,
      addressManual,
      mapLocation,
      existingDeedImageUrl,
      existingDeedFrontImageUrl,
      existingDeedBackImageUrl,
      existingInheritanceImageUrl,
      existingHeirsPoaImageUrl,
      existingEndowmentCertImageUrl,
      existingTrusteeshipImageUrl,
      existingGuardiansPoaImageUrl,
      existingAddressImageUrl,
    } = state;

    const deedComplete = isPropertyDeedDataComplete({
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
      hasMinorHeirs,
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

    if (!deedComplete || selectedDeedType === "") {
      return {
        ok: false as const,
        error: "Deed data is incomplete",
      };
    }

    if (
      !isPropertyDetailsComplete(propertyDetails) ||
      (propertyDeedTypeIsAdversePossession(selectedDeedType) &&
        !isStrongArgumentDetailsComplete(propertyDetails))
    ) {
      return {
        ok: false as const,
        error: "Property details are incomplete",
      };
    }

    if (!addressMethod) {
      return {
        ok: false as const,
        error: "National address method is required",
      };
    }

    if (shouldUpdate && !propertyId) {
      return {
        ok: false as const,
        error: "Property ID is missing",
      };
    }

    setIsSubmitting(true);

    try {
      const needsFrontBack = propertyDeedTypeNeedsFrontBack(selectedDeedType);
      const isDeceasedOwner = propertyDeedTypeIsDeceasedOwner(selectedDeedType);
      const isWaqfOwner = propertyDeedTypeIsWaqfOwner(selectedDeedType);

      const localInstrument = resolveDraftFile(deedFiles, deedPersistedFiles);
      const localFront = resolveDraftFile(deedFrontFiles, deedFrontPersistedFiles);
      const localBack = resolveDraftFile(deedBackFiles, deedBackPersistedFiles);
      const localInheritance = resolveDraftFile(
        deedInheritanceFiles,
        deedInheritancePersistedFiles,
      );
      const localHeirsPoa = resolveDraftFile(
        deedHeirsPoaFiles,
        deedHeirsPoaPersistedFiles,
      );
      const localEndowmentCert = resolveDraftFile(
        deedEndowmentCertFiles,
        deedEndowmentCertPersistedFiles,
      );
      const localTrusteeship = resolveDraftFile(
        deedTrusteeshipFiles,
        deedTrusteeshipPersistedFiles,
      );
      const localGuardiansPoa = resolveDraftFile(
        deedGuardiansPoaFiles,
        deedGuardiansPoaPersistedFiles,
      );
      const localAddressPhoto = resolveDraftFile(
        addressPhotoFiles,
        addressPhotoPersistedFiles,
      );

      // On update, re-attach existing remote docs when the user did not pick a
      // replacement — Laravel update/step1 otherwise keeps only text fields.
      const [
        instrumentFile,
        frontFile,
        backFile,
        inheritanceFile,
        heirsPoaFile,
        endowmentCertFile,
        trusteeshipFile,
        guardiansPoaFile,
        addressPhotoFile,
      ] = await Promise.all([
        resolveUploadFile({
          localFile: localInstrument,
          existingUrl: shouldUpdate ? existingDeedImageUrl : null,
          fallbackFileName: "image_instrument",
        }),
        resolveUploadFile({
          localFile: localFront,
          existingUrl: shouldUpdate ? existingDeedFrontImageUrl : null,
          fallbackFileName: "image_instrument_front",
        }),
        resolveUploadFile({
          localFile: localBack,
          existingUrl: shouldUpdate ? existingDeedBackImageUrl : null,
          fallbackFileName: "image_instrument_back",
        }),
        resolveUploadFile({
          localFile: localInheritance,
          existingUrl: shouldUpdate ? existingInheritanceImageUrl : null,
          fallbackFileName: "Image_inheritance_certificate",
        }),
        resolveUploadFile({
          localFile: localHeirsPoa,
          existingUrl: shouldUpdate ? existingHeirsPoaImageUrl : null,
          fallbackFileName: "copy_power_of_attorney_from_heirs_to_agent",
        }),
        resolveUploadFile({
          localFile: localEndowmentCert,
          existingUrl: shouldUpdate ? existingEndowmentCertImageUrl : null,
          fallbackFileName: "copy_of_the_endowment_registration_certificate",
        }),
        resolveUploadFile({
          localFile: localTrusteeship,
          existingUrl: shouldUpdate ? existingTrusteeshipImageUrl : null,
          fallbackFileName: "copy_of_the_trusteeship_deed",
        }),
        resolveUploadFile({
          localFile: localGuardiansPoa,
          existingUrl: shouldUpdate ? existingGuardiansPoaImageUrl : null,
          fallbackFileName: "copy_of_guardians_power_of_attorney_for_agent",
        }),
        resolveUploadFile({
          localFile: localAddressPhoto,
          existingUrl:
            shouldUpdate && addressMethod === "photo"
              ? existingAddressImageUrl
              : null,
          fallbackFileName: "image_address",
        }),
      ]);

      if (isDeceasedOwner && !inheritanceFile) {
        return {
          ok: false as const,
          error: "Inheritance certificate is required",
        };
      }

      if (isDeceasedOwner && !heirsPoaFile) {
        return {
          ok: false as const,
          error: "Heirs power of attorney is required",
        };
      }

      if (
        isDeceasedOwner &&
        !needsFrontBack &&
        !useManualDeedEntry &&
        !instrumentFile
      ) {
        return {
          ok: false as const,
          error: "Deed image is required",
        };
      }

      const formData = new FormData();
      appendPropertyStep1Fields(formData, {
        propertyId: shouldUpdate ? propertyId ?? undefined : undefined,
        contractType,
        instrumentType: mapPropertyDeedTypeToApiInstrumentType(selectedDeedType),
        propertyDetails,
        includeStrongArgumentFields:
          propertyDeedTypeIsAdversePossession(selectedDeedType),
        imageInstrument:
          needsFrontBack || useManualDeedEntry ? undefined : instrumentFile,
        imageInstrumentFront:
          needsFrontBack && !useManualDeedEntry ? frontFile : undefined,
        imageInstrumentBack:
          needsFrontBack && !useManualDeedEntry ? backFile : undefined,
        manualDeedEntry: useManualDeedEntry ? manualDeedEntry : undefined,
        imageInheritanceCertificate: isDeceasedOwner
          ? inheritanceFile
          : undefined,
        copyPowerOfAttorneyFromHeirsToAgent: isDeceasedOwner
          ? heirsPoaFile
          : undefined,
        copyOfTheEndowmentRegistrationCertificate: isWaqfOwner
          ? endowmentCertFile
          : undefined,
        copyOfTheTrusteeshipDeed: isWaqfOwner ? trusteeshipFile : undefined,
        isMultipleTrusteeshipDeedCopy: isWaqfOwner
          ? isMultipleTrusteeshipDeedCopy
          : undefined,
        copyOfGuardiansPowerOfAttorneyForAgent:
          (isWaqfOwner && isMultipleTrusteeshipDeedCopy) ||
          (isDeceasedOwner && hasMinorHeirs)
            ? guardiansPoaFile
            : undefined,
        addressMethod,
        imageAddress: addressMethod === "photo" ? addressPhotoFile : undefined,
        addressUrl:
          addressMethod === "link"
            ? addressLinkUrl.trim() || undefined
            : undefined,
        manualAddress: addressMethod === "manual" ? addressManual : undefined,
        latitude: mapLocation.lat,
        longitude: mapLocation.lng,
      });

      const result = shouldUpdate
        ? await postPropertyStep1FormData("/api/realstate/step1/update", formData)
        : await postPropertyStep1FormData("/api/realstate/step1", formData);

      if (!result.ok) {
        return result;
      }

      setPropertyId(shouldUpdate ? propertyId : result.propertyId);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    propertyId,
    isSubmitting,
    submitStep1,
  };
}
