"use client";
import {
  ArrowUpLeft,
  Building2,
  CircleDollarSign,
  Hand,
  Home,
  MessageCircle,
  UserCheck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CreateContractPaperworkIcon from "@/features/create-contract/components/create-contract-paperwork-icon";
import CreateContractRequirementItem from "@/features/create-contract/components/create-contract-requirement-item";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import {
  toPropertyContractType,
  type ContractTypeId,
} from "@/features/create-contract/types/contract-type";
import { usePaperwork } from "@/features/create-contract/hooks/use-paperwork";
import { useServicesPricing } from "@/features/create-contract/hooks/use-services-pricing";
import CustomIcon from "@/features/shared/components/custom-icon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type CreateContractIntroStepProps = {
  labels: CreateContractLabels["intro"];
  stepperLabels: CreateContractLabels["stepper"];
  contractType: ContractTypeId;
  prices: CreateContractLabels["prices"];
  onStart: () => void | Promise<void>;
  isStarting?: boolean;
};

const requirementIcons = [
  UserCheck,
  Building2,
  Home,
  CircleDollarSign,
  MessageCircle,
  UserCheck,
] as const;

export default function CreateContractIntroStep({
  labels,
  contractType,
  prices,
  onStart,
  isStarting = false,
}: CreateContractIntroStepProps) {
  const price = prices[contractType];
  const [open, setOpen] = useState(false);

  const propertyContractType = toPropertyContractType(contractType);

  const { data: paperwork, isLoading } = usePaperwork(propertyContractType);

  const { data: servicesPricing, isLoading: isPricingLoading } =
    useServicesPricing(propertyContractType);

  const fallbackRequirements = labels.requirements.slice(0, -1);
  const hasApiItems = Boolean(paperwork && paperwork.length > 0);
  const hasPricingItems = Boolean(servicesPricing && servicesPricing.length > 0);

  return (
    <div className="space-y-3 p-3 md:space-y-4 md:p-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="mb-2 inline-flex text-brand dark:text-[#7dccc0]">
          <Hand className="size-6" aria-hidden="true" />
        </span>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-brand md:text-3xl dark:text-[#7dccc0]">
            {labels.title}
          </h2>
          <p className="text-sm text-[#7f7f7f] dark:text-[#9eb5af]">
            {labels.subtitle}
          </p>
        </div>
      </div>

      <div>
        {isLoading && !hasApiItems ? (
          <div className="space-y-2 py-2">
            {fallbackRequirements.map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-2">
                <span className="size-8 shrink-0 animate-pulse rounded-full bg-[#ececec] dark:bg-[#24302c]" />
                <span className="h-4 flex-1 animate-pulse rounded bg-[#ececec] dark:bg-[#24302c]" />
              </div>
            ))}
          </div>
        ) : null}

        {hasApiItems
          ? paperwork!.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b border-[#ececec] py-2 last:border-b-0 dark:border-[#2f403b]"
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center">
                  <CreateContractPaperworkIcon src={item.icon} />
                </span>

                <p className="flex-1 font-medium text-[#333333] dark:text-white">
                  {item.name}
                </p>
              </div>
            ))
          : null}

        {!isLoading && !hasApiItems
          ? fallbackRequirements.map((text, index) => (
              <CreateContractRequirementItem
                key={text}
                text={text}
                icon={requirementIcons[index]}
              />
            ))
          : null}
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-brand-secondary/30 bg-brand-background-green px-5 py-4 dark:border-[#2f403b] dark:bg-[#16352f]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[#333333] dark:text-[#9eb5af]">
              {labels.priceLabel}
            </p>

            <p className="flex items-center gap-1 text-xl font-extrabold text-brand dark:text-[#7dccc0]">
              {price}
              <CustomIcon
                src="/icons/ryal.svg"
                size={24}
                className="text-brand dark:text-[#7dccc0]"
              />
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-1 py-1 text-sm font-medium text-brand dark:text-[#7dccc0]"
            >
              {labels.viewAllPrices}
              <ArrowUpLeft className="size-4" aria-hidden="true" />
            </button>
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            className="gap-0 overflow-hidden rounded-3xl p-6 sm:max-w-md dark:bg-[#1a2421]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#ececec] pb-4 dark:border-[#2f403b]">
              <DialogTitle className="text-base font-bold leading-snug text-foreground dark:text-white">
                {labels.priceDialog.title}
              </DialogTitle>

              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-[#24302c]"
                  aria-label={labels.priceDialog.close}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </DialogClose>
            </div>

            {isPricingLoading && !hasPricingItems ? (
              <ul className="mt-5 space-y-3">
                {[0, 1, 2].map((index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-4 py-1"
                  >
                    <span className="h-4 w-40 animate-pulse rounded bg-[#ececec] dark:bg-[#24302c]" />
                    <span className="h-4 w-12 animate-pulse rounded bg-[#ececec] dark:bg-[#24302c]" />
                  </li>
                ))}
              </ul>
            ) : null}

            {hasPricingItems ? (
              <ul className="mt-5 space-y-3 leading-relaxed text-[#333333] dark:text-white">
                {servicesPricing!.map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between gap-4 border-b border-[#ececec] pb-3 last:border-b-0 dark:border-[#2f403b]"
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="flex shrink-0 items-center gap-1 font-bold text-brand dark:text-[#7dccc0]">
                      {item.price}
                      <CustomIcon
                        src="/icons/ryal.svg"
                        size={16}
                        className="text-brand dark:text-[#7dccc0]"
                      />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {!isPricingLoading && !hasPricingItems ? (
              <ul className="mt-5 list-disc space-y-6 ps-5 leading-relaxed text-[#333333] dark:text-white">
                <li>{labels.priceDialog.yearOrLess}</li>
                <li>{labels.priceDialog.additionalYear}</li>
              </ul>
            ) : null}

            <DialogClose asChild>
              <Button
                type="button"
                className="mt-6 h-12 w-full rounded-full bg-[#ececec] text-base font-semibold text-[#666666] hover:bg-brand hover:text-white dark:bg-[#24302c] dark:text-[#9eb5af] dark:hover:bg-[#0f6b5c] dark:hover:text-white"
              >
                {labels.priceDialog.close}
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <Button
          type="button"
          onClick={() => void onStart()}
          disabled={isStarting}
          className="h-12 w-full rounded-xl bg-linear-to-br from-brand-secondary via-brand to-brand text-base font-extrabold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isStarting ? labels.startContractLoading : labels.start}
        </Button>
      </div>
    </div>
  );
}
