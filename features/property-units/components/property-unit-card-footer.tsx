"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MY_PROPERTY_EJAR_LOGO } from "@/features/my-properties/data/my-property-actions-config";
import MyPropertyPlusIcon from "@/features/my-properties/components/my-property-plus-icon";
import PropertyUnitCommercialPlusIcon from "@/features/property-units/components/property-unit-commercial-plus-icon";
import type { PropertyUnitCategory } from "@/features/property-units/types/property-unit";

type PropertyUnitCardFooterProps = {
  category: PropertyUnitCategory;
};

export default function PropertyUnitCardFooter({
  category,
}: PropertyUnitCardFooterProps) {
  const t = useTranslations("propertyUnits.card");

  const contractLabel =
    category === "residential"
      ? t("createResidentialContract")
      : t("createCommercialContract");

  return (
    <div className="space-y-4 pt-2">
      <Link
        href="/create-contract"
        className="flex h-14 w-full items-center justify-between rounded-[20px] bg-linear-to-l from-brand-secondary to-brand px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        <span className="flex-1 text-center leading-6">{contractLabel}</span>
        <span className="relative h-7 w-16 shrink-0">
          <Image
            src={MY_PROPERTY_EJAR_LOGO}
            alt={t("ejarLogoAlt")}
            fill
            sizes="64px"
            className="object-contain object-center"
          />
        </span>
      </Link>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-[#ececec]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs font-medium text-muted-foreground">
            {t("orDivider")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/properties/create-unit"
          className="flex h-12 items-center justify-between rounded-full bg-[#f0f7f6] px-3 text-[11px] font-bold text-brand transition-colors hover:bg-[#e4f2ef] md:text-xs"
        >
          <MyPropertyPlusIcon />
          <span className="truncate ps-2">{t("createNewResidentialUnit")}</span>
        </Link>

        <Link
          href="/properties/create-unit"
          className="flex h-12 items-center justify-between rounded-full bg-[#f5f5f5] px-3 text-[11px] font-bold text-foreground/80 transition-colors hover:bg-[#ececec] md:text-xs"
        >
          <span className="truncate pe-2">{t("createNewCommercialUnit")}</span>
          <PropertyUnitCommercialPlusIcon />
        </Link>
      </div>
    </div>
  );
}
