"use client";

import { isPropertyReviewDataComplete } from "@/features/create-property/types/review-step";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertyReviewStep() {
  const reviewData = useCreatePropertyDraftStore((state) => state.reviewData);
  const setReviewData = useCreatePropertyDraftStore((state) => state.setReviewData);

  const canContinue = isPropertyReviewDataComplete(reviewData);

  return {
    reviewData,
    setReviewData,
    canContinue,
  };
}
