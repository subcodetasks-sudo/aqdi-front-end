import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

export function resetCreatePropertyDraft() {
  useCreatePropertyDraftStore.getState().initializeNewSession();
}
