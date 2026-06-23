import {
  Building2,
  Download,
  FilePenLine,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment } from "react";

import {
  CREATE_PROPERTY_STEPPER_STEPS,
  type CreatePropertyStepperStep,
} from "@/features/create-property/types/create-property-step";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

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
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-brand-secondary via-brand to-[#083d36] text-white shadow-sm md:size-12";

const CONNECTOR_CLASSNAME =
  "mx-2 h-0.5 min-w-4 flex-1 rounded-full bg-brand-secondary md:mx-3";

export default function CreatePropertyStepper({
  labels,
}: CreatePropertyStepperProps) {
  return (
    <div className="bg-white rounded-2xl  px-4 py-4 md:rounded-3xl md:px-6 md:py-5">
      <div className="flex items-center">
        {CREATE_PROPERTY_STEPPER_STEPS.map((step, index) => {
          const Icon = STEPPER_ICONS[step];

          return (
            <Fragment key={step}>
              <span title={labels.steps[step]} className={STEP_CIRCLE_CLASSNAME}>
                <Icon className="size-5" aria-hidden="true" />
              </span>

              {index < CREATE_PROPERTY_STEPPER_STEPS.length - 1 ? (
                <span className={CONNECTOR_CLASSNAME} aria-hidden="true" />
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
