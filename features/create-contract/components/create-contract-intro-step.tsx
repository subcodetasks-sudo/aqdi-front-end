"use client";
import {
  ArrowUpLeft,
  Building2,
  CircleDollarSign,
  Hand,
  Home,
  Info,
  MessageCircle,
  UserCheck,
  X,
} from "lucide-react";
import Image from "next/image";

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
  stepperLabels,
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

  const ejarRowText =
    labels.requirements[labels.requirements.length - 1] ?? "";
  const fallbackRequirements = labels.requirements.slice(0, -1);
  const hasApiItems = Boolean(paperwork && paperwork.length > 0);
  const hasPricingItems = Boolean(servicesPricing && servicesPricing.length > 0);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="inline-flex text-brand mb-4">
            <Hand className="size-6" aria-hidden="true" />
          </span>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-brand md:text-3xl">
              {labels.title}
            </h2>
            <p className="text-sm text-[#7f7f7f]">{labels.subtitle}</p>
          </div>
        </div>

        <div>
          {isLoading && !hasApiItems ? (
            <div className="space-y-2 py-2">
              {fallbackRequirements.map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2"
                >
                  <span className="size-8 shrink-0 animate-pulse rounded-full bg-[#ececec]" />
                  <span className="h-4 flex-1 animate-pulse rounded bg-[#ececec]" />
                </div>
              ))}
            </div>
          ) : null}

          {hasApiItems
            ? paperwork!.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b border-[#ececec] py-2 last:border-b-0"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center">
                    <CreateContractPaperworkIcon src={item.icon} />
                  </span>

                  <p className="flex-1 font-medium text-[#333333]">
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
      </div>

          <div className="rounded-2xl border border-brand-secondary/30 bg-brand-background-green px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-[#333333]">
                {labels.priceLabel}
              </p>

              <p className="flex items-center gap-1 text-xl font-extrabold text-brand">
                {price}
                <CustomIcon
                  src="/icons/ryal.svg"
                  size={24}
                  className="text-brand"
                />
              </p>
            </div>
          </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="cursor-pointer">
        <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-1 text-sm font-medium text-brand "
        >
          {labels.viewAllPrices}
          <ArrowUpLeft className="size-4" aria-hidden="true" />
        </div>
      </div>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden rounded-3xl p-6 sm:max-w-md"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#ececec] pb-4">
            <DialogTitle className="text-base font-bold leading-snug text-foreground">
              {labels.priceDialog.title}
            </DialogTitle>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
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
                  <span className="h-4 w-40 animate-pulse rounded bg-[#ececec]" />
                  <span className="h-4 w-12 animate-pulse rounded bg-[#ececec]" />
                </li>
              ))}
            </ul>
          ) : null}

          {hasPricingItems ? (
            <ul className="mt-5 space-y-3 leading-relaxed text-[#333333]">
              {servicesPricing!.map((item, index) => (
                <li
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between gap-4 border-b border-[#ececec] pb-3 last:border-b-0"
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="flex shrink-0 items-center gap-1 font-bold text-brand">
                    {item.price}
                    <CustomIcon
                      src="/icons/ryal.svg"
                      size={16}
                      className="text-brand"
                    />
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {!isPricingLoading && !hasPricingItems ? (
            <ul className="mt-5 list-disc space-y-6 ps-5 text leading-relaxed text-[#333333]">
              <li>{labels.priceDialog.yearOrLess}</li>
              <li>{labels.priceDialog.additionalYear}</li>
            </ul>
          ) : null}

          {/* <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-secondary/30 bg-brand-background-green px-4 py-3">
            <Info
              className="size-5 shrink-0 text-brand-secondary"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-[#333333]">
              {labels.priceDialog.disclaimer}
            </p>
          </div> */}

          <DialogClose asChild>
            <Button
              type="button"
              className="mt-6 h-12 w-full rounded-full bg-[#ececec] text-base font-semibold text-[#666666] hover:bg-brand hover:text-white"
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
  );
}
