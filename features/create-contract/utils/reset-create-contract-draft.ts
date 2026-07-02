import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function resetCreateContractDraft() {
  useCreateContractDraftStore.getState().resetDraft();
  localStorage.removeItem("aqdi-create-contract-draft");
}
