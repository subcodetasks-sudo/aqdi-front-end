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
import type { PropertyTypeId } from "@/features/properties/types/property-type";
import type { PropertyEditDraftData } from "@/features/create-property/utils/map-property-api-to-draft";
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
  const [completedPropertyId, setCompletedPropertyId] = useState<number | null>(
    null,
  );
  const [completedPropertyName, setCompletedPropertyName] = useState("");
  const isEditMode = initialEditDraft !== null;
  const [isEditSessionReady, setIsEditSessionReady] = useState(!isEditMode);
  const isDraftHydrated = usePersistStoreHydrated(
    useCreatePropertyDraftStore.persist,
  );

  useEffect(() => {
    if (!initialEditDraft) {
      setIsEditSessionReady(true);
      return;
    }

    // Wait for persist rehydration first; otherwise a stale create draft can
    // overwrite the API-backed edit session (including empty owner fields).
    if (!isDraftHydrated) {
      setIsEditSessionReady(false);
      return;
    }

    setCompletedPropertyId(null);
    setCompletedPropertyName("");
    initializeEditSession(initialEditDraft);
    setIsEditSessionReady(true);
  }, [initialEditDraft, initializeEditSession, isDraftHydrated]);

  useEffect(() => {
    if (currentStep === "success" && completedPropertyId === null) {
      setCurrentStep("deed");
    }
  }, [completedPropertyId, currentStep, setCurrentStep]);

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
                onBack={() => router.back()}
                onComplete={goNext}
              />
            ) : null}

            {!isSuccess && currentStep === "owner" ? (
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
