import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

let shouldResetDraftOnUnmount = false;

export function scheduleCreateContractDraftResetOnUnmount() {
  shouldResetDraftOnUnmount = true;
}

export function resetCreateContractDraftIfScheduledOnUnmount() {
  if (!shouldResetDraftOnUnmount) {
    return;
  }

  shouldResetDraftOnUnmount = false;
  resetCreateContractDraft();
}

export function resetCreateContractDraft() {
  shouldResetDraftOnUnmount = false;
  useCreateContractDraftStore.getState().resetDraft();
  localStorage.removeItem("aqdi-create-contract-draft");
}
