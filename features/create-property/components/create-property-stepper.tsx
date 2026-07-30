"use client";

import { Fragment } from "react";
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
  completed?: boolean;
};

const stepPillClassName =
  "inline-flex items-center justify-center rounded-full grow h-12 px-3 text-sm font-semibold whitespace-nowrap transition-all";

function getStepPillClassName(
  isActive: boolean,
  isUnlocked: boolean,
  completed: boolean,
) {
  return cn(
    stepPillClassName,
    completed
      ? "cursor-default bg-brand-background-green text-brand dark:bg-[#16352f] dark:text-[#7dccc0]"
      : isUnlocked
        ? "cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-secondary/30"
        : "cursor-not-allowed opacity-50",
    !completed &&
      (isActive
        ? "bg-brand text-white shadow-md ring-2 ring-brand-secondary ring-offset-2"
        : "bg-brand-background-green text-brand dark:bg-[#16352f] dark:text-[#7dccc0]"),
  );
}

function getConnectorClassName(isCompleted: boolean) {
  return cn(
    "h-0 w-3 shrink-0 border-t-2 sm:w-5",
    isCompleted
      ? "border-solid border-brand-secondary"
      : "border-dashed border-[#d9d9d9] dark:border-[#2f403b]",
  );
}

export default function CreatePropertyStepper({
  labels,
  completed = false,
}: CreatePropertyStepperProps) {
  const { currentStepIndex, goToStep } = useCreatePropertySteps();

  function isStepUnlocked(step: CreatePropertyStepperStep) {
    if (completed) {
      return false;
    }

    const stepIndex = CREATE_PROPERTY_STEPS.indexOf(step);
    return stepIndex >= 0 && stepIndex <= currentStepIndex;
  }

  return (
    <div className="sticky top-0 z-20 rounded-t-3xl bg-white p-4 md:p-5 dark:bg-[#1a2421]">
      <div className="flex w-full flex-nowrap items-center justify-evenly gap-1.5 sm:gap-2">
        {completed ? (
          <>
            <span className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-full border border-brand/15 bg-white px-3 text-sm font-semibold text-brand shadow-sm dark:border-[#2f403b] dark:bg-[#1a2421] dark:text-[#7dccc0]">
              <Image
                src="/images/logo.png"
                alt=""
                width={20}
                height={22}
                aria-hidden="true"
                className="h-5 w-auto shrink-0 object-contain"
              />
              <span>{labels.brand}</span>
            </span>
            <span
              aria-hidden="true"
              className={getConnectorClassName(true)}
            />
          </>
        ) : null}

        {CREATE_PROPERTY_STEPPER_STEPS.map((step, index) => {
          const stepIndex = CREATE_PROPERTY_STEPS.indexOf(step);
          const isActive = !completed && stepIndex === currentStepIndex;
          const isStepCompleted = completed || stepIndex < currentStepIndex;
          const isUnlocked = isStepUnlocked(step);

          return (
            <Fragment key={step}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={getConnectorClassName(isActive || isStepCompleted)}
                />
              )}

              <button
                type="button"
                title={labels.steps[step]}
                aria-label={labels.steps[step]}
                aria-current={isActive ? "step" : undefined}
                disabled={!isUnlocked}
                onClick={() => goToStep(step)}
                className={getStepPillClassName(isActive, isUnlocked, completed)}
              >
                {labels.steps[step]}
              </button>
            </Fragment>
          );
        })}

        {completed ? (
          <span
            aria-hidden="true"
            className={getConnectorClassName(true)}
          />
        ) : null}

        <span
          title={labels.saveAlt}
          aria-label={labels.saveAlt}
          className={cn(
            "inline-flex size-12 shrink-0 items-center justify-center rounded-full border-2 text-brand dark:text-[#7dccc0]",
            completed
              ? "border-brand bg-brand-background-green dark:border-brand-secondary dark:bg-[#16352f]"
              : "border-dashed border-brand/40 bg-white dark:border-brand-secondary/50 dark:bg-[#16352f]",
          )}
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
          className="h-auto min-w-0 flex-1 object-contain object-right dark:opacity-70"
        />
        <p className="shrink-0 text-center text-xs font-medium text-brand md:text-sm dark:text-[#7dccc0]">
          {labels.journey}
        </p>
        <Image
          src="/images/contract-line-l.svg"
          alt=""
          width={203}
          height={26}
          aria-hidden="true"
          className="h-auto min-w-0 flex-1 object-contain object-left dark:opacity-70"
        />
      </div>
    </div>
  );
}
