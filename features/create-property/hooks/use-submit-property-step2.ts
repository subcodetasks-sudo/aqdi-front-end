"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { submitPropertyStep2 } from "@/features/create-property/services/submit-property-step2";
import { updatePropertyStep2 } from "@/features/create-property/services/update-property-step2";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
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
  const hasExistingPowerOfAttorney = useCreatePropertyDraftStore(
    (state) => state.hasExistingPowerOfAttorney,
  );
  const ownerData = useCreatePropertyDraftStore((state) => state.ownerData);
  const agentData = useCreatePropertyDraftStore((state) => state.agentData);
  const reviewData = useCreatePropertyDraftStore((state) => state.reviewData);
  const isEditMode = urlPropertyId !== null;
  const propertyId = urlPropertyId ?? storePropertyId;

  async function submitStep2() {
    if (!propertyId) {
      return {
        ok: false as const,
        error: "Property ID is missing. Please complete the previous steps.",
      };
    }

    if (!isPropertyOwnerDataComplete(ownerData)) {
      return {
        ok: false as const,
        error: "Owner data is incomplete",
      };
    }

    if (
      ownerData.hasAgent === "yes" &&
      !isPropertyAgentDataComplete(agentData, {
        allowExistingPowerOfAttorney: isEditMode && hasExistingPowerOfAttorney,
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
        ownerData,
        agentData,
      };

      return isEditMode
        ? await updatePropertyStep2(payload)
        : await submitPropertyStep2(payload);
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
