"use client";

import { useRouter } from "next/navigation";

import CreatePropertyAddressStep from "@/features/create-property/components/create-property-address-step";
import CreatePropertyDeedStep from "@/features/create-property/components/create-property-deed-step";
import CreatePropertyOwnerStep from "@/features/create-property/components/create-property-owner-step";
import CreatePropertyReviewStep from "@/features/create-property/components/create-property-review-step";
import CreatePropertyStepper from "@/features/create-property/components/create-property-stepper";
import CreatePropertySuccessStep from "@/features/create-property/components/create-property-success-step";
import { useCreatePropertySteps } from "@/features/create-property/hooks/use-create-property-steps";
import {
  CREATE_PROPERTY_STEPPER_STEPS,
  type CreatePropertyStep,
} from "@/features/create-property/types/create-property-step";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

type CreatePropertyWizardProps = {
  labels: CreatePropertyLabels;
};

function getStepperIndex(step: CreatePropertyStep) {
  if (step === "success") {
    return CREATE_PROPERTY_STEPPER_STEPS.length - 1;
  }

  const index = CREATE_PROPERTY_STEPPER_STEPS.indexOf(
    step as (typeof CREATE_PROPERTY_STEPPER_STEPS)[number],
  );

  return index >= 0 ? index : 0;
}

export default function CreatePropertyWizard({ labels }: CreatePropertyWizardProps) {
  const router = useRouter();
  const { currentStep, goNext, goBack } = useCreatePropertySteps();
  const showStepper = currentStep !== "success";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
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
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "success" ? (
        <CreatePropertySuccessStep labels={labels.success} />
      ) : null}
    </div>
  );
}
