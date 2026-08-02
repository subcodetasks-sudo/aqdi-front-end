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
  "inline-flex h-8 min-w-0 flex-1 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold transition-all sm:h-12 sm:grow sm:px-3 sm:text-sm";

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
        ? "bg-brand text-white shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#0db38b] dark:shadow-[0_0_0_2px_#1a2421,0_0_0_4px_#0db38b] sm:shadow-none sm:ring-2 sm:ring-brand-secondary sm:ring-offset-2"
        : "bg-brand-background-green text-brand dark:bg-[#16352f] dark:text-[#7dccc0]"),
  );
}

function getConnectorClassName(isCompleted: boolean) {
  return cn(
    "h-0 w-1 shrink-0 border-t-2 sm:w-5",
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
    <div className="rounded-t-3xl bg-white px-2 py-2.5 sm:px-4 sm:py-4 md:p-5 dark:bg-[#1a2421]">
      <div className="flex w-full min-w-0 items-center gap-0.5 py-0.5 sm:justify-evenly sm:gap-2">
        {completed ? (
          <>
            <span className="inline-flex h-8 max-w-[4.5rem] shrink-0 items-center gap-0.5 rounded-full border border-brand/15 bg-white px-1.5 text-[10px] font-semibold text-brand shadow-sm sm:h-12 sm:max-w-none sm:gap-1.5 sm:px-3 sm:text-sm dark:border-[#2f403b] dark:bg-[#1a2421] dark:text-[#7dccc0]">
              <Image
                src="/images/logo.png"
                alt=""
                width={20}
                height={22}
                aria-hidden="true"
                className="h-3.5 w-auto shrink-0 object-contain sm:h-5"
              />
              <span className="truncate">{labels.brand}</span>
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
                <span className="truncate">{labels.steps[step]}</span>
              </button>
            </Fragment>
          );
        })}

        {completed ? (
          <span
            aria-hidden="true"
            className={getConnectorClassName(true)}
          />
        ) : (
          <span
            aria-hidden="true"
            className={getConnectorClassName(false)}
          />
        )}

        <span
          title={labels.saveAlt}
          aria-label={labels.saveAlt}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-brand sm:size-12 dark:text-[#7dccc0]",
            completed
              ? "border-brand bg-brand-background-green dark:border-brand-secondary dark:bg-[#16352f]"
              : "border-dashed border-brand/40 bg-white dark:border-brand-secondary/50 dark:bg-[#16352f]",
          )}
        >
          <Save className="size-3.5 sm:size-5" aria-hidden="true" />
        </span>
      </div>

      <div dir="rtl" className="mx-auto mt-2 flex w-full max-w-[95%] items-end gap-1.5 sm:mt-4 sm:w-[90%] sm:gap-2">
        <Image
          src="/images/contract-line-r.svg"
          alt=""
          width={203}
          height={26}
          aria-hidden="true"
          className="h-auto min-w-0 flex-1 object-contain object-right dark:opacity-70"
        />
        <p className="max-w-[55%] shrink-0 truncate text-center text-[10px] font-medium text-brand sm:max-w-none sm:text-xs md:text-sm dark:text-[#7dccc0]">
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
