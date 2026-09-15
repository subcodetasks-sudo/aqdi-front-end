import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";

let shouldResetDraftOnUnmount = false;

export function scheduleCreatePropertyDraftResetOnUnmount() {
  shouldResetDraftOnUnmount = true;
}

export function resetCreatePropertyDraftIfScheduledOnUnmount() {
  if (!shouldResetDraftOnUnmount) {
    return;
  }

  shouldResetDraftOnUnmount = false;
  resetCreatePropertyDraft();
}

export function resetCreatePropertyDraft() {
  shouldResetDraftOnUnmount = false;
  useCreatePropertyDraftStore.getState().initializeNewSession();
}
