"use client";

import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertyDeedStep() {
  const selectedDeedType = useCreatePropertyDraftStore(
    (state) => state.selectedDeedType,
  );
  const deedFiles = useCreatePropertyDraftStore((state) => state.deedFiles);
  const existingDeedImageUrl = useCreatePropertyDraftStore(
    (state) => state.existingDeedImageUrl,
  );
  const setSelectedDeedType = useCreatePropertyDraftStore(
    (state) => state.setSelectedDeedType,
  );
  const setDeedFiles = useCreatePropertyDraftStore((state) => state.setDeedFiles);

  const canContinue =
    selectedDeedType !== "" &&
    (deedFiles.length === 1 || Boolean(existingDeedImageUrl));

  return {
    selectedDeedType,
    setSelectedDeedType,
    deedFiles,
    setDeedFiles,
    existingDeedImageUrl,
    canContinue,
  };
}
