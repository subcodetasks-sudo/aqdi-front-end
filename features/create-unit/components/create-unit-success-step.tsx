"use client";

import { Building2, CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";

type CreateUnitSuccessStepProps = {
  labels: CreateUnitLabels["success"];
};

export default function CreateUnitSuccessStep({
  labels,
}: CreateUnitSuccessStepProps) {
  const actions = [
    {
      href: labels.actions.viewPropertyHref,
      label: labels.actions.viewProperty,
      icon: <Building2 className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      href: labels.actions.addUnitHref,
      label: labels.actions.addUnit,
      icon: <CirclePlus className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      href: labels.actions.createContractHref,
      label: labels.actions.createContract,
      icon: (
        <Image
          src="/images/ejar.png"
          alt={labels.actions.ejarLogoAlt}
          width={40}
          height={16}
          className="h-4 w-auto shrink-0 object-contain"
        />
      ),
    },
  ];

  return (
    <div>
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex items-center justify-center pb-2">
            <span
              className="absolute top-8 size-16 rounded-full bg-brand-secondary blur-2xl"
              aria-hidden="true"
            />
            <div className="relative flex size-20 items-center justify-center rounded-full bg-linear-to-bl from-brand-secondary via-brand to-brand shadow-[0_10px_28px_rgba(13,179,139,0.28)]">
              <CustomIcon
                src="/icons/shiled-check.svg"
                size={32}
                className="text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold leading-relaxed text-brand md:text-3xl">
              {labels.title}
            </h2>
            <p className="text-sm leading-relaxed text-[#7f7f7f]">
              {labels.description}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              type="button"
              asChild
              variant="ghost"
              className="h-14 w-full justify-center gap-3 rounded-full bg-brand/10 px-4 text-sm font-semibold text-brand hover:bg-brand-background-green/80"
            >
              <Link href={action.href}>
                <span className="text-start">{action.label}</span>
                {action.icon}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <Button
        type="button"
        asChild
        className="mt-6 h-12 w-full rounded-xl bg-linear-to-br from-brand-secondary via-brand to-brand text-base font-extrabold text-white hover:opacity-90"
      >
        <Link href={labels.mainMenuHref}>
          <CustomIcon src="/icons/arrow-r.svg" size={24} />
          {labels.mainMenu}
          <CustomIcon src="/icons/arrow-l.svg" size={24} />
        </Link>
      </Button>
    </div>
  );
}
