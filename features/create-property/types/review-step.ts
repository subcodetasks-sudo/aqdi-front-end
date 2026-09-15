export type PropertyReviewDataState = {
  propertyName: string;
};

export const EMPTY_PROPERTY_REVIEW_DATA: PropertyReviewDataState = {
  propertyName: "",
};

export function isPropertyReviewDataComplete(
  reviewData: PropertyReviewDataState,
) {
  return reviewData.propertyName.trim().length > 0;
}
