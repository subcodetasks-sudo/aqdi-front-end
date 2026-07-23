"use client";

import Image from "next/image";

import { useCreateContractSteps } from "@/features/create-contract/hooks/use-create-contract-steps";
import {
  CREATE_CONTRACT_STEPPER_STEPS,
  CREATE_CONTRACT_STEPS,
} from "@/features/create-contract/types/create-contract-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { cn } from "@/lib/utils";

type CreateContractStepperProps = {
  labels: CreateContractLabels["stepper"];
};

const stepPillClassName =
  "inline-flex items-center justify-center rounded-full grow h-12 text-sm font-semibold whitespace-nowrap transition-all";

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
      ? "bg-brand text-white ring-2 ring-brand-secondary ring-offset-2"
      : isCompleted
        ? "bg-brand text-white"
        : "bg-brand-background text-[#666666] dark:bg-[#16352f] dark:text-[#9eb5af]",
  );
}

export default function CreateContractStepper({
  labels,
}: CreateContractStepperProps) {
  const { currentStep, currentStepIndex, goToStep, isStepUnlocked } =
    useCreateContractSteps();
  const isPaymentStep = currentStep === "payment";

  return (
    <div className="sticky top-0 z-20 rounded-3xl bg-white p-4 shadow-sm md:p-5 dark:border dark:border-[#2f403b] dark:bg-[#1a2421]">
      <div className="flex w-full flex-nowrap items-center justify-evenly gap-1.5 sm:gap-2">
        {CREATE_CONTRACT_STEPPER_STEPS.map((step) => {
          const stepIndex = CREATE_CONTRACT_STEPS.indexOf(step);
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

        <button
          type="button"
          title={labels.ejarLogoAlt}
          aria-label={labels.ejarLogoAlt}
          aria-current={isPaymentStep ? "step" : undefined}
          disabled={!isStepUnlocked("payment")}
          onClick={() => goToStep("payment")}
          className={cn(
            stepPillClassName,
            isStepUnlocked("payment")
              ? "cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-secondary/30"
              : "cursor-not-allowed opacity-50",
            isPaymentStep
              ? "bg-brand ring-2 ring-brand-secondary ring-offset-2"
              : "bg-brand-background dark:bg-[#16352f]",
          )}
        >
          <Image
            src="/images/ejar.png"
            alt={labels.ejarLogoAlt}
            width={88}
            height={32}
            className={cn(
              "h-8 w-auto shrink-0 object-contain",
              isPaymentStep && "brightness-0 invert",
              !isPaymentStep && "dark:brightness-125",
            )}
          />
        </button>
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
