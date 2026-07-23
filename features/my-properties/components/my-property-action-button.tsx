"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  MY_PROPERTY_EJAR_LOGO,
  type MyPropertyActionIconType,
} from "@/features/my-properties/data/my-property-actions-config";
import CustomIcon from "@/features/shared/components/custom-icon";

type MyPropertyActionButtonProps = {
  href: string;
  label: string;
  iconType: MyPropertyActionIconType;
  iconSrc?: string;
};

export default function MyPropertyActionButton({
  href,
  label,
  iconType,
  iconSrc,
}: MyPropertyActionButtonProps) {
  const t = useTranslations("myProperties.card");

  function renderIcon() {
    if (iconType === "plus") {
      return (
        <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
          <Building2 className="size-4 text-brand" aria-hidden="true" />
          <PlusCircle className="absolute -end-1 -top-1 size-3 text-brand-secondary" aria-hidden="true" />
        </span>
      );
    }

    if (iconType === "ejar") {
      return (
        <span className="relative h-6 w-14 shrink-0">
          <Image
            src={MY_PROPERTY_EJAR_LOGO}
            alt={t("ejarLogoAlt")}
            fill
            sizes="56px"
            className="object-contain object-center"
          />
        </span>
      );
    }

    return (
      <CustomIcon
        src={iconSrc ?? ""}
        size={20}
        className="shrink-0 text-brand"
      />
    );
  }

  return (
    <Link
      href={href}
      className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl bg-[#f3f7f6] px-4 text-sm font-bold text-brand transition-colors hover:bg-[#e8f1ef]"
    >
      <span className="min-w-0 flex-1 text-start leading-5">{label}</span>
      {renderIcon()}
    </Link>
  );
}
