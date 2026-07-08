"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MY_PROPERTY_EJAR_LOGO } from "@/features/my-properties/data/my-property-actions-config";
import MyPropertyPlusIcon from "@/features/my-properties/components/my-property-plus-icon";
import PropertyUnitCommercialPlusIcon from "@/features/property-units/components/property-unit-commercial-plus-icon";
import { useStartContractFromUnit } from "@/features/create-contract/hooks/use-start-contract-from-unit";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";
import type { PropertyWithUnitsApiData } from "@/features/property-units/types/property-units-api";

type PropertyUnitCardFooterProps = {
  unit: PropertyUnitCardData;
  property: PropertyWithUnitsApiData | null;
};

function buildCreateUnitHref(
  propertyId: number,
  contractType: PropertyUnitCardData["contractType"],
) {
  const params = new URLSearchParams({
    propertyId: String(propertyId),
    contract_type: contractType,
  });

  return `/properties/create-unit?${params.toString()}`;
}

export default function PropertyUnitCardFooter({
  unit,
  property,
}: PropertyUnitCardFooterProps) {
  const t = useTranslations("propertyUnits.card");
  const { startContract, isStarting } = useStartContractFromUnit();

  const contractLabel =
    unit.category === "residential"
      ? t("createResidentialContract")
      : t("createCommercialContract");

  const createUnitHref = buildCreateUnitHref(unit.propertyId, unit.contractType);
  const isResidential = unit.category === "residential";

  return (
    <div className="space-y-4 pt-2">
      <button
        type="button"
        disabled={!property || isStarting}
        onClick={() => {
          if (property) {
            void startContract(unit, property);
          }
        }}
        className="flex h-14 w-full items-center justify-between rounded-[20px] bg-linear-to-l from-brand-secondary to-brand px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex-1 text-center leading-6">
          {isStarting ? t("startContractLoading") : contractLabel}
        </span>
        <span className="relative h-7 w-16 shrink-0">
          <Image
            src={MY_PROPERTY_EJAR_LOGO}
            alt={t("ejarLogoAlt")}
            fill
            sizes="64px"
            className="object-contain object-center"
          />
        </span>
      </button>

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

      {isResidential ? (
        <Link
          href={createUnitHref}
          className="flex h-12 w-full items-center justify-between rounded-full bg-[#f0f7f6] px-4 text-xs font-bold text-brand transition-colors hover:bg-[#e4f2ef] md:text-sm"
        >
          <span>{t("createNewResidentialUnit")}</span>
          <MyPropertyPlusIcon />
        </Link>
      ) : (
        <Link
          href={createUnitHref}
          className="flex h-12 w-full items-center justify-between rounded-full bg-[#f0f7f6] px-4 text-xs font-bold text-brand transition-colors hover:bg-[#ececec] md:text-sm"
        >
          <span>{t("createNewCommercialUnit")}</span>
          <PropertyUnitCommercialPlusIcon />
        </Link>
      )}
    </div>
  );
}
