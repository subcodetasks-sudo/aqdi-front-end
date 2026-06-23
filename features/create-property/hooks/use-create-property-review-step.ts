"use client";

import { useState } from "react";

import {
  EMPTY_PROPERTY_REVIEW_DATA,
  isPropertyReviewDataComplete,
  type PropertyReviewDataState,
} from "@/features/create-property/types/review-step";

export function useCreatePropertyReviewStep() {
  const [reviewData, setReviewData] = useState<PropertyReviewDataState>(
    EMPTY_PROPERTY_REVIEW_DATA,
  );

  const canContinue = isPropertyReviewDataComplete(reviewData);

  return {
    reviewData,
    setReviewData,
    canContinue,
  };
}
