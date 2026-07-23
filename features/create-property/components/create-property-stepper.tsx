"use client";

import Image from "next/image";
import { Save } from "lucide-react";

import { useCreatePropertySteps } from "@/features/create-property/hooks/use-create-property-steps";
import {
  CREATE_PROPERTY_STEPS,
  CREATE_PROPERTY_STEPPER_STEPS,
  type CreatePropertyStepperStep,
} from "@/features/create-property/types/create-property-step";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { cn } from "@/lib/utils";

type CreatePropertyStepperProps = {
  labels: CreatePropertyLabels["stepper"];
};

const stepPillClassName =
  "inline-flex items-center justify-center rounded-full grow h-12 px-3 text-sm font-semibold whitespace-nowrap transition-all";

function getStepPillClassName(
  isActive: boolean,
  isCompleted: boolean,
  isUnlocked: boolean,
) {
  return cn(
    stepPillClassName,
    isUnlocked
      ? "cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-secondary/30"
      : "cursor-not-allowed opacity-50",
    isActive
      ? "bg-brand text-white shadow-md ring-2 ring-brand-secondary ring-offset-2"
      : isCompleted
        ? "bg-brand text-white"
        : "bg-brand-background-green text-brand",
  );
}

export default function CreatePropertyStepper({
  labels,
}: CreatePropertyStepperProps) {
  const { currentStepIndex, goToStep } = useCreatePropertySteps();

  function isStepUnlocked(step: CreatePropertyStepperStep) {
    const stepIndex = CREATE_PROPERTY_STEPS.indexOf(step);
    return stepIndex >= 0 && stepIndex <= currentStepIndex;
  }

  return (
    <div className="sticky top-0 z-20 rounded-3xl bg-white p-4 shadow-sm md:p-5">
      <div className="flex w-full flex-nowrap items-center justify-evenly gap-1.5 sm:gap-2">
        {CREATE_PROPERTY_STEPPER_STEPS.map((step) => {
          const stepIndex = CREATE_PROPERTY_STEPS.indexOf(step);
          const isCompleted = stepIndex < currentStepIndex;
          const isActive = stepIndex === currentStepIndex;
          const isUnlocked = isStepUnlocked(step);

          return (
            <button
              key={step}
              type="button"
              title={labels.steps[step]}
              aria-label={labels.steps[step]}
              aria-current={isActive ? "step" : undefined}
              disabled={!isUnlocked}
              onClick={() => goToStep(step)}
              className={getStepPillClassName(isActive, isCompleted, isUnlocked)}
            >
              {labels.steps[step]}
            </button>
          );
        })}

        <span
          title={labels.saveAlt}
          aria-label={labels.saveAlt}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-brand/40 bg-white text-brand"
        >
          <Save className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div dir="rtl" className="mx-auto mt-4 flex w-[90%] items-end gap-2">
        <Image
          src="/images/contract-line-r.svg"
          alt=""
          width={203}
          height={26}
          aria-hidden="true"
          className="h-auto min-w-0 flex-1 object-contain object-right"
        />
        <p className="shrink-0 text-center text-xs font-medium text-brand md:text-sm">
          {labels.journey}
        </p>
        <Image
          src="/images/contract-line-l.svg"
          alt=""
          width={203}
          height={26}
          aria-hidden="true"
          className="h-auto min-w-0 flex-1 object-contain object-left"
        />
      </div>
    </div>
  );
}
