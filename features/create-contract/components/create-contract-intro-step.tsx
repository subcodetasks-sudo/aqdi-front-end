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
import Link from "next/link";

import { Button } from "@/components/ui/button";
import CreateContractRequirementItem from "@/features/create-contract/components/create-contract-requirement-item";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
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
          {labels.requirements.map((text, index) => {
            const isLastItem = index === labels.requirements.length - 1;

            if (isLastItem) {
              return (
                <div
                  key={text}
                  className="flex items-center  gap-3 border-b border-[#ececec] py-2 last:border-b-0"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center text-brand-secondary">
                    <CustomIcon
                      src="/icons/check.svg"
                      size={20}
                      className="text-brand-secondary"
                    />
                  </span>

                  <p className="shrink-0 font-medium text-[#333333]">{text}</p>

                  <Image
                    src="/images/ejar.png"
                    alt={stepperLabels.ejarLogoAlt}
                    width={56}
                    height={20}
                    className="h-5 w-auto shrink-0 object-contain"
                  />
                </div>
              );
            }

            return (
              <CreateContractRequirementItem
                key={text}
                text={text}
                icon={requirementIcons[index]}
              />
            );
          })}
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
        <DialogTrigger asChild>
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

          <ul className="mt-5 list-disc space-y-6 ps-5 text leading-relaxed text-[#333333]">
            <li>{labels.priceDialog.yearOrLess}</li>
            <li>{labels.priceDialog.additionalYear}</li>
          </ul>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-secondary/30 bg-brand-background-green px-4 py-3">
            <Info
              className="size-5 shrink-0 text-brand-secondary"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-[#333333]">
              {labels.priceDialog.disclaimer}
            </p>
          </div>

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
