"use client";

import {
  Building2,
  Download,
  FilePenLine,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment } from "react";

import { useCreatePropertySteps } from "@/features/create-property/hooks/use-create-property-steps";
import {
  CREATE_PROPERTY_STEPPER_STEPS,
  type CreatePropertyStepperStep,
} from "@/features/create-property/types/create-property-step";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { cn } from "@/lib/utils";

type CreatePropertyStepperProps = {
  labels: CreatePropertyLabels["stepper"];
};

const STEPPER_ICONS: Record<CreatePropertyStepperStep, LucideIcon> = {
  deed: Building2,
  address: FilePenLine,
  owner: User,
  review: Download,
};

const STEP_CIRCLE_CLASSNAME =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-brand-secondary via-brand to-[#083d36] text-white shadow-sm transition-all md:size-12";

const CONNECTOR_CLASSNAME =
  "mx-2 h-0.5 min-w-4 flex-1 rounded-full bg-brand-secondary md:mx-3";

export default function CreatePropertyStepper({
  labels,
}: CreatePropertyStepperProps) {
  const { currentStepIndex, goToStep } = useCreatePropertySteps();

  return (
    <div className="rounded-2xl bg-white px-4 py-4 md:rounded-3xl md:px-6 md:py-5">
      <div className="flex items-center">
        {CREATE_PROPERTY_STEPPER_STEPS.map((step, index) => {
          const Icon = STEPPER_ICONS[step];
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <Fragment key={step}>
              <button
                type="button"
                title={labels.steps[step]}
                aria-label={labels.steps[step]}
                aria-current={isActive ? "step" : undefined}
                onClick={() => goToStep(step)}
                className={cn(
                  STEP_CIRCLE_CLASSNAME,
                  "cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-secondary/30",
                  isActive && "ring-2 ring-brand-secondary ring-offset-2",
                  !isActive && !isCompleted && "opacity-60",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </button>

              {index < CREATE_PROPERTY_STEPPER_STEPS.length - 1 ? (
                <span
                  className={cn(
                    CONNECTOR_CLASSNAME,
                    index < currentStepIndex && "bg-brand",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
