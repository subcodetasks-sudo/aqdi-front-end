"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CreatePropertyDeedStep from "@/features/create-property/components/create-property-deed-step";
import CreatePropertyHeader from "@/features/create-property/components/create-property-header";
import CreatePropertyOwnerStep from "@/features/create-property/components/create-property-owner-step";
import CreatePropertyReviewStep from "@/features/create-property/components/create-property-review-step";
import CreatePropertyStepper from "@/features/create-property/components/create-property-stepper";
import CreatePropertySuccessStep from "@/features/create-property/components/create-property-success-step";
import { useCreatePropertySteps } from "@/features/create-property/hooks/use-create-property-steps";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { propertyDeedTypeIsDeceasedOwner } from "@/features/create-property/types/deed-type";
import {
  isPropertyAgentDataComplete,
} from "@/features/create-property/types/owner-step";
import type { PropertyTypeId } from "@/features/properties/types/property-type";
import type { PropertyEditDraftData } from "@/features/create-property/utils/map-property-api-to-draft";
import { toPropertyContractType } from "@/features/create-property/utils/contract-type";
import { isOwnerStepSkipped } from "@/features/create-property/utils/is-owner-step-skipped";
import {
  resetCreatePropertyDraft,
  resetCreatePropertyDraftIfScheduledOnUnmount,
  scheduleCreatePropertyDraftResetOnUnmount,
} from "@/features/create-property/utils/reset-create-property-draft";
import CreateFlowDraftHydrator from "@/features/shared/components/create-flow-draft-hydrator";
import { usePersistStoreHydrated } from "@/features/shared/hooks/use-persist-store-hydrated";

type CreatePropertyWizardProps = {
  labels: CreatePropertyLabels;
  propertyType: PropertyTypeId;
  initialEditDraft: PropertyEditDraftData | null;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
};

export default function CreatePropertyWizard({
  labels,
  propertyType,
  initialEditDraft,
  isDarkMode = false,
  onToggleDarkMode,
}: CreatePropertyWizardProps) {
  const router = useRouter();
  const { currentStep, goNext, goBack } = useCreatePropertySteps();
  const setCurrentStep = useCreatePropertyDraftStore(
    (state) => state.setCurrentStep,
  );
  const initializeEditSession = useCreatePropertyDraftStore(
    (state) => state.initializeEditSession,
  );
  const hydrateFilesFromPersisted = useCreatePropertyDraftStore(
    (state) => state.hydrateFilesFromPersisted,
  );
  const selectedDeedType = useCreatePropertyDraftStore(
    (state) => state.selectedDeedType,
  );
  const skipOwnerToReview = useCreatePropertyDraftStore(
    (state) => state.skipOwnerToReview,
  );
  const agentData = useCreatePropertyDraftStore((state) => state.agentData);
  const hasExistingPowerOfAttorney = useCreatePropertyDraftStore(
    (state) => state.hasExistingPowerOfAttorney,
  );
  const storeIsEditMode = useCreatePropertyDraftStore((state) => state.isEditMode);
  const ownerSkipped = isOwnerStepSkipped({ selectedDeedType });
  const deceasedOwner = propertyDeedTypeIsDeceasedOwner(selectedDeedType);
  const [completedPropertyId, setCompletedPropertyId] = useState<number | null>(
    null,
  );
  const [completedPropertyName, setCompletedPropertyName] = useState("");
  const isEditMode = initialEditDraft !== null;
  const [initializedEditDraft, setInitializedEditDraft] =
    useState<PropertyEditDraftData | null>(null);
  const isDraftHydrated = usePersistStoreHydrated(
    useCreatePropertyDraftStore.persist,
  );
  const isEditSessionReady =
    !initialEditDraft || initializedEditDraft === initialEditDraft;

  useEffect(() => {
    // Wait for persist rehydration first; otherwise a stale create draft can
    // overwrite the API-backed edit session (including empty owner fields).
    if (!initialEditDraft || !isDraftHydrated) {
      return;
    }

    initializeEditSession(initialEditDraft);
    // Readiness has to trail the external store reset above, so it can't be
    // derived during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitializedEditDraft(initialEditDraft);
  }, [initialEditDraft, initializeEditSession, isDraftHydrated]);

  useEffect(() => {
    if (currentStep === "success" && completedPropertyId === null) {
      setCurrentStep("deed");
    }
  }, [completedPropertyId, currentStep, setCurrentStep]);

  useEffect(() => {
    if (currentStep === "owner" && ownerSkipped) {
      skipOwnerToReview();
    }
  }, [currentStep, ownerSkipped, skipOwnerToReview]);

  // Old drafts skipped the owner step for deceased deeds and landed on review.
  // Send those flows back to the agent step until agent data is complete.
  useEffect(() => {
    if (!deceasedOwner || currentStep !== "review") {
      return;
    }

    const agentComplete = isPropertyAgentDataComplete(agentData, {
      allowExistingPowerOfAttorney:
        storeIsEditMode && hasExistingPowerOfAttorney,
    });

    if (!agentComplete) {
      setCurrentStep("owner");
    }
  }, [
    agentData,
    currentStep,
    deceasedOwner,
    hasExistingPowerOfAttorney,
    setCurrentStep,
    storeIsEditMode,
  ]);

  useEffect(() => {
    return () => {
      resetCreatePropertyDraftIfScheduledOnUnmount();
    };
  }, []);

  const isSuccess = completedPropertyId !== null;
  const canRenderSteps = isDraftHydrated && isEditSessionReady;

  function handleReviewComplete(propertyId: number) {
    const isEditMode = initialEditDraft !== null;
    const propertyName =
      useCreatePropertyDraftStore.getState().reviewData.propertyName.trim();

    if (isEditMode) {
      scheduleCreatePropertyDraftResetOnUnmount();
      toast.success(labels.review.navigation.updateSuccess);
      router.push("/properties/my-properties");
      return;
    }

    resetCreatePropertyDraft();
    setCompletedPropertyName(propertyName);
    setCompletedPropertyId(propertyId);
  }

  const pageTitle = isEditMode
    ? propertyType === "residential"
      ? labels.editPageTitleResidential
      : labels.editPageTitleCommercial
    : labels.pageTitle;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-2">
      {initialEditDraft || isSuccess ? null : (
        <CreateFlowDraftHydrator hydrate={hydrateFilesFromPersisted} />
      )}

      <CreatePropertyHeader
        pageTitle={pageTitle}
        labels={labels.header}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode ?? (() => undefined)}
      />

      <div className="rounded-3xl bg-white shadow-sm dark:border dark:border-[#2f403b] dark:bg-[#1a2421]">
        {canRenderSteps ? (
          <>
            <CreatePropertyStepper
              labels={labels.stepper}
              completed={isSuccess}
            />

            {isSuccess && completedPropertyId ? (
              <CreatePropertySuccessStep
                labels={labels.success}
                propertyType={propertyType}
                propertyId={completedPropertyId}
                propertyName={completedPropertyName}
              />
            ) : null}

            {!isSuccess && currentStep === "deed" ? (
              <CreatePropertyDeedStep
                labels={labels.deed}
                addressLabels={labels.address}
                contractType={toPropertyContractType(propertyType)}
                onBack={() => router.back()}
                onComplete={goNext}
              />
            ) : null}

            {!isSuccess && currentStep === "owner" && !ownerSkipped ? (
              <CreatePropertyOwnerStep
                labels={labels.owner}
                onBack={goBack}
                onComplete={goNext}
              />
            ) : null}

            {!isSuccess && currentStep === "review" ? (
              <CreatePropertyReviewStep
                labels={labels.review}
                onBack={goBack}
                onComplete={handleReviewComplete}
              />
            ) : null}
          </>
        ) : (
          <div
            aria-busy="true"
            className="min-h-112 bg-white dark:bg-[#1a2421]"
          />
        )}
      </div>
    </div>
  );
}
