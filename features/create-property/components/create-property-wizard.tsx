"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CreatePropertyAddressStep from "@/features/create-property/components/create-property-address-step";
import CreatePropertyDeedStep from "@/features/create-property/components/create-property-deed-step";
import CreatePropertyOwnerStep from "@/features/create-property/components/create-property-owner-step";
import CreatePropertyReviewStep from "@/features/create-property/components/create-property-review-step";
import CreatePropertyStepper from "@/features/create-property/components/create-property-stepper";
import CreatePropertySuccessStep from "@/features/create-property/components/create-property-success-step";
import { useCreatePropertySteps } from "@/features/create-property/hooks/use-create-property-steps";
import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyTypeId } from "@/features/properties/types/property-type";
import type { PropertyEditDraftData } from "@/features/create-property/utils/map-property-api-to-draft";
import CreateFlowDraftHydrator from "@/features/shared/components/create-flow-draft-hydrator";

type CreatePropertyWizardProps = {
  labels: CreatePropertyLabels;
  propertyType: PropertyTypeId;
  initialEditDraft: PropertyEditDraftData | null;
};

export default function CreatePropertyWizard({
  labels,
  propertyType,
  initialEditDraft,
}: CreatePropertyWizardProps) {
  const router = useRouter();
  const { currentStep, goNext, goBack } = useCreatePropertySteps();
  const resetDraft = useCreatePropertyDraftStore((state) => state.resetDraft);
  const setCurrentStep = useCreatePropertyDraftStore((state) => state.setCurrentStep);
  const initializeEditSession = useCreatePropertyDraftStore(
    (state) => state.initializeEditSession,
  );
  const hydrateFilesFromPersisted = useCreatePropertyDraftStore(
    (state) => state.hydrateFilesFromPersisted,
  );
  const [completedPropertyId, setCompletedPropertyId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (initialEditDraft) {
      initializeEditSession(initialEditDraft);
    }
  }, [initialEditDraft, initializeEditSession]);

  useEffect(() => {
    if (currentStep === "success" && completedPropertyId === null) {
      setCurrentStep("deed");
    }
  }, [completedPropertyId, currentStep, setCurrentStep]);

  function handleReviewComplete() {
    const isEditMode = initialEditDraft !== null;
    resetDraft();

    if (isEditMode) {
      toast.success(labels.review.navigation.updateSuccess);
      router.push("/properties/my-properties");
      return;
    }

    setCompletedPropertyId(useCreatePropertyDraftStore.getState().propertyId);
  }

  if (completedPropertyId) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <CreatePropertySuccessStep
          labels={labels.success}
          propertyType={propertyType}
          propertyId={completedPropertyId}
        />
      </div>
    );
  }

  const showStepper = currentStep !== "success";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      {initialEditDraft ? null : (
        <CreateFlowDraftHydrator hydrate={hydrateFilesFromPersisted} />
      )}
      {showStepper ? (
        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
          <CreatePropertyStepper labels={labels.stepper} />
        </div>
      ) : null}

      {currentStep === "deed" ? (
        <CreatePropertyDeedStep
          labels={labels.deed}
          onBack={() => router.back()}
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "address" ? (
        <CreatePropertyAddressStep
          labels={labels.address}
          onBack={goBack}
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "owner" ? (
        <CreatePropertyOwnerStep
          labels={labels.owner}
          onBack={goBack}
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "review" ? (
        <CreatePropertyReviewStep
          labels={labels.review}
          onBack={goBack}
          onComplete={handleReviewComplete}
        />
      ) : null}
    </div>
  );
}
