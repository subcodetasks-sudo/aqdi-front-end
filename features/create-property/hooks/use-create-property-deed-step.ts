"use client";

import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function useCreatePropertyDeedStep() {
  const selectedDeedType = useCreatePropertyDraftStore(
    (state) => state.selectedDeedType,
  );
  const deedFiles = useCreatePropertyDraftStore((state) => state.deedFiles);
  const setSelectedDeedType = useCreatePropertyDraftStore(
    (state) => state.setSelectedDeedType,
  );
  const setDeedFiles = useCreatePropertyDraftStore((state) => state.setDeedFiles);

  const canContinue = selectedDeedType !== "" && deedFiles.length > 0;

  return {
    selectedDeedType,
    setSelectedDeedType,
    deedFiles,
    setDeedFiles,
    canContinue,
  };
}
