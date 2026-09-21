"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { submitPropertyStep2 } from "@/features/create-property/services/submit-property-step2";
import { updatePropertyStep2 } from "@/features/create-property/services/update-property-step2";
import {
  finishPropertyStep3,
  finishPropertyStep3Update,
} from "@/features/create-property/services/finish-property-step3";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import {
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsWaqfOwner,
} from "@/features/create-property/types/deed-type";
import {
  isPropertyAgentDataComplete,
  isPropertyOwnerDataComplete,
} from "@/features/create-property/types/owner-step";
import { isPropertyReviewDataComplete } from "@/features/create-property/types/review-step";
import { parsePropertyId } from "@/features/create-property/utils/parse-property-id";

export function useSubmitPropertyStep2() {
  const searchParams = useSearchParams();
  const urlPropertyId = parsePropertyId(searchParams.get("propertyId") ?? undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storePropertyId = useCreatePropertyDraftStore((state) => state.propertyId);
  const selectedDeedType = useCreatePropertyDraftStore(
    (state) => state.selectedDeedType,
  );
  const hasExistingPowerOfAttorney = useCreatePropertyDraftStore(
    (state) => state.hasExistingPowerOfAttorney,
  );
  const ownerData = useCreatePropertyDraftStore((state) => state.ownerData);
  const agentData = useCreatePropertyDraftStore((state) => state.agentData);
  const reviewData = useCreatePropertyDraftStore((state) => state.reviewData);
  const propertyId = urlPropertyId ?? storePropertyId;
  const shouldUpdate = propertyId !== null && (urlPropertyId !== null || storePropertyId !== null);
  const agentOnly =
    propertyDeedTypeIsDeceasedOwner(selectedDeedType) ||
    propertyDeedTypeIsWaqfOwner(selectedDeedType);

  async function submitStep2() {
    if (!propertyId) {
      return {
        ok: false as const,
        error: "Property ID is missing. Please complete the previous steps.",
      };
    }

    if (!agentOnly && !isPropertyOwnerDataComplete(ownerData)) {
      return {
        ok: false as const,
        error: "Owner data is incomplete",
      };
    }

    if (
      (agentOnly || ownerData.hasAgent === "yes") &&
      !isPropertyAgentDataComplete(agentData, {
        allowExistingPowerOfAttorney:
          shouldUpdate && hasExistingPowerOfAttorney,
      })
    ) {
      return {
        ok: false as const,
        error: "Agent data is incomplete",
      };
    }

    if (!isPropertyReviewDataComplete(reviewData)) {
      return {
        ok: false as const,
        error: "Property name is required",
      };
    }

    setIsSubmitting(true);

    try {
      const payload = {
        propertyId,
        propertyName: reviewData.propertyName,
        ownerData: agentOnly
          ? { ...ownerData, hasAgent: "yes" as const }
          : ownerData,
        agentData,
        agentOnly,
      };

      const step2Result = shouldUpdate
        ? await updatePropertyStep2(payload)
        : await submitPropertyStep2(payload);

      if (!step2Result.ok) {
        return step2Result;
      }

      // Units are optional — finish step 3 with id only (add units later).
      const step3Result = shouldUpdate
        ? await finishPropertyStep3Update(propertyId)
        : await finishPropertyStep3(propertyId);

      if (!step3Result.ok) {
        return step3Result;
      }

      return {
        ok: true as const,
        propertyId,
        message: step3Result.message || step2Result.message,
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    propertyId,
    isSubmitting,
    submitStep2,
  };
}
