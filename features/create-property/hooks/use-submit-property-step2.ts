"use client";

import { useState } from "react";

import { submitPropertyStep2 } from "@/features/create-property/services/submit-property-step2";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import {
  isPropertyAgentDataComplete,
  isPropertyOwnerDataComplete,
} from "@/features/create-property/types/owner-step";
import { isPropertyReviewDataComplete } from "@/features/create-property/types/review-step";

export function useSubmitPropertyStep2() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const propertyId = useCreatePropertyDraftStore((state) => state.propertyId);
  const ownerData = useCreatePropertyDraftStore((state) => state.ownerData);
  const agentData = useCreatePropertyDraftStore((state) => state.agentData);
  const reviewData = useCreatePropertyDraftStore((state) => state.reviewData);

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

    if (ownerData.hasAgent === "yes" && !isPropertyAgentDataComplete(agentData)) {
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
      return await submitPropertyStep2({
        propertyId,
        propertyName: reviewData.propertyName,
        ownerData,
        agentData,
      });
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
