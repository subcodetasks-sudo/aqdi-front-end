"use client";

import { Fragment, useEffect } from "react";
import Image from "next/image";

import { useCreateContractSteps } from "@/features/create-contract/hooks/use-create-contract-steps";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import {
  CREATE_CONTRACT_STEPPER_STEPS,
  CREATE_CONTRACT_STEPS,
} from "@/features/create-contract/types/create-contract-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { isOwnerStepSkipped } from "@/features/create-contract/utils/is-owner-step-skipped";
import { cn } from "@/lib/utils";

type CreateContractStepperProps = {
  labels: CreateContractLabels["stepper"];
};

const stepPillClassName =
  "relative inline-flex items-center justify-center rounded-full grow h-12 text-sm font-semibold whitespace-nowrap transition-all";

const skippedStrikeClassName =
  "after:pointer-events-none after:absolute after:inset-x-1.5 after:top-1/2 after:h-[1.5px] after:[transform-origin:right_center] after:rounded-full after:bg-brand after:content-['']";

function getStepPillClassName(
  isActive: boolean,
  isCompleted: boolean,
  isUnlocked: boolean,
  isSkipped: boolean,
  showStrike: boolean,
  isSkipAnimating: boolean,
) {
  if (isSkipped) {
    return cn(
      stepPillClassName,
      "cursor-not-allowed bg-[#f0f0f0] text-[#c4c4c4] dark:bg-[#24302c] dark:text-[#6a7a74]",
      showStrike && skippedStrikeClassName,
      showStrike &&
        (isSkipAnimating
          ? "after:animate-strike-in"
          : "after:[transform:translateY(-50%)_scaleX(1)]"),
    );
  }

  return cn(
    stepPillClassName,
    isUnlocked
      ? "cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-secondary/30"
      : "cursor-not-allowed opacity-50",
    isActive
      ? "bg-brand text-white ring-2 ring-brand-secondary ring-offset-2"
      : isCompleted
        ? "bg-brand-background-green text-brand dark:bg-[#16352f] dark:text-[#7dccc0]"
        : "bg-brand-background text-[#666666] dark:bg-[#16352f] dark:text-[#9eb5af]",
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

export default function CreateContractStepper({
  labels,
}: CreateContractStepperProps) {
  const { currentStep, currentStepIndex, goToStep, isStepUnlocked } =
    useCreateContractSteps();
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const instrumentType = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.instrument_type,
  );
  const skippingOwnerStep = useCreateContractDraftStore(
    (state) => state.skippingOwnerStep,
  );
  const clearSkippingOwnerStep = useCreateContractDraftStore(
    (state) => state.clearSkippingOwnerStep,
  );
  const isPaymentStep = currentStep === "payment";
  const ownerSkipped = isOwnerStepSkipped({
    selectedDeedType,
    instrumentType,
  });

  useEffect(() => {
    if (!skippingOwnerStep) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearSkippingOwnerStep();
    }, 750);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [skippingOwnerStep, clearSkippingOwnerStep]);

  return (
    <div className="sticky top-0 z-20 rounded-t-3xl bg-white p-4 shadow-sm [clip-path:inset(-8px_-8px_0_-8px)] md:p-5 dark:border dark:border-b-0 dark:border-[#2f403b] dark:bg-[#1a2421]">
      <div className="flex w-full flex-nowrap items-center justify-evenly gap-1.5 sm:gap-2">
        {CREATE_CONTRACT_STEPPER_STEPS.map((step, index) => {
          const stepIndex = CREATE_CONTRACT_STEPS.indexOf(step);
          const isSkipped = step === "owner" && ownerSkipped;
          const isPassed = stepIndex < currentStepIndex;
          const isCompleted = isPassed && !isSkipped;
          const isActive = stepIndex === currentStepIndex;
          const isUnlocked = isStepUnlocked(step);
          const isIntro = step === "intro";
          const showOwnerStrike =
            isSkipped && (isPassed || skippingOwnerStep);
          const connectorCompleted =
            isActive || isCompleted || (isSkipped && isPassed);

          return (
            <Fragment key={step}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={getConnectorClassName(connectorCompleted)}
                />
              )}

              <button
                type="button"
                title={labels.steps[step]}
                aria-label={labels.steps[step]}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={isSkipped || !isUnlocked}
                disabled={isSkipped || !isUnlocked}
                onClick={() => goToStep(step)}
                className={
                  isIntro
                    ? cn(
                        stepPillClassName,
                        "gap-1.5 border border-brand/15 bg-white px-3 text-brand shadow-sm dark:border-[#2f403b] dark:bg-[#1a2421] dark:text-[#7dccc0]",
                        isUnlocked
                          ? "cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-secondary/30"
                          : "cursor-not-allowed opacity-50",
                      )
                    : getStepPillClassName(
                        isActive,
                        isCompleted,
                        isUnlocked,
                        isSkipped,
                        showOwnerStrike,
                        isSkipped && skippingOwnerStep,
                      )
                }
              >
                {isIntro && (
                  <Image
                    src="/images/logo.png"
                    alt=""
                    width={20}
                    height={22}
                    aria-hidden="true"
                    className="h-5 w-auto shrink-0 object-contain"
                  />
                )}
                <span>{labels.steps[step]}</span>
              </button>
            </Fragment>
          );
        })}

        <span
          aria-hidden="true"
          className={getConnectorClassName(isPaymentStep)}
        />

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
