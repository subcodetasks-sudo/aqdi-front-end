import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

let shouldResetDraftOnUnmount = false;

export function waitForCreateContractDraftHydration() {
  const persistApi = useCreateContractDraftStore.persist;

  if (persistApi.hasHydrated()) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const unsubscribe = persistApi.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });

    if (persistApi.hasHydrated()) {
      unsubscribe();
      resolve();
    }
  });
}

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

export function shouldDiscardPersistedContractDraft(input: {
  hasRequestedContractType: boolean;
  contractType: ContractTypeId;
  currentStep: CreateContractStep;
  sessionContractType: PropertyContractType | null;
}) {
  const hasSession = input.sessionContractType != null;
  const hasProgress = hasSession || input.currentStep !== "intro";

  if (!hasProgress) {
    return false;
  }

  if (!input.hasRequestedContractType) {
    return true;
  }

  if (!input.sessionContractType) {
    return false;
  }

  const sessionTypeId: ContractTypeId =
    input.sessionContractType === "commercial" ? "commercial" : "residential";

  return sessionTypeId !== input.contractType;
}

export function resetCreateContractDraft() {
  shouldResetDraftOnUnmount = false;
  useCreateContractDraftStore.getState().resetDraft();
  localStorage.removeItem("aqdi-create-contract-draft");
}
