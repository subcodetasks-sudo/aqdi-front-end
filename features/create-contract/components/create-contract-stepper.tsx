import Image from "next/image";

import {
  CREATE_CONTRACT_STEPPER_STEPS,
  CREATE_CONTRACT_STEPS,
} from "@/features/create-contract/types/create-contract-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { cn } from "@/lib/utils";

type CreateContractStepperProps = {
  labels: CreateContractLabels["stepper"];
  currentStepIndex: number;
  currentStep: (typeof CREATE_CONTRACT_STEPS)[number];
};

const stepPillClassName =
  "inline-flex items-center justify-center rounded-full grow h-12  text-sm font-semibold whitespace-nowrap";

function getStepPillClassName(isActive: boolean) {
  return cn(
    stepPillClassName,
    isActive
      ? "bg-brand text-white"
      : "bg-brand-background text-[#666666]",
  );
}

export default function CreateContractStepper({
  labels,
  currentStepIndex,
  currentStep,
}: CreateContractStepperProps) {
  const isPaymentStep = currentStep === "payment";
  const isEjarActive = isPaymentStep;

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
      <div className="flex w-full flex-nowrap items-center justify-evenly gap-1.5 sm:gap-2">
        {CREATE_CONTRACT_STEPPER_STEPS.map((step) => {
          const stepIndex = CREATE_CONTRACT_STEPS.indexOf(step);
          const isCompleted = isPaymentStep || stepIndex < currentStepIndex;
          const isActive = stepIndex === currentStepIndex && !isPaymentStep;

          return (
            <span
              key={step}
              className={getStepPillClassName(isActive || isCompleted)}
            >
              {labels.steps[step]}
            </span>
          );
        })}

        <span
          className={cn(
            stepPillClassName,
            isEjarActive ? "bg-brand" : "bg-brand-background",
          )}
        >
          <Image
            src="/images/ejar.png"
            alt={labels.ejarLogoAlt}
            width={88}
            height={32}
            className={cn(
              "h-8 w-auto shrink-0 object-contain",
              isEjarActive && "brightness-0 invert",
            )}
          />
        </span>
      </div>

      <div dir="rlt"  className="mt-4 flex w-[90%] mx-auto items-end gap-2">
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
