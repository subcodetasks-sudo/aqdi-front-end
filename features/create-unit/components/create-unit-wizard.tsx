"use client";

import { useRouter } from "next/navigation";

import CreateUnitStep from "@/features/create-unit/components/create-unit-step";
import CreateUnitSuccessStep from "@/features/create-unit/components/create-unit-success-step";
import { useCreateUnitSteps } from "@/features/create-unit/hooks/use-create-unit-steps";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";

type CreateUnitWizardProps = {
  labels: CreateUnitLabels;
};

export default function CreateUnitWizard({ labels }: CreateUnitWizardProps) {
  const router = useRouter();
  const { currentStep, goNext } = useCreateUnitSteps();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      {currentStep === "form" ? (
        <CreateUnitStep
          labels={labels}
          onBack={() => router.back()}
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "success" ? (
        <CreateUnitSuccessStep labels={labels.success} />
      ) : null}
    </div>
  );
}
