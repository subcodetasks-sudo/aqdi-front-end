"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import MyPropertyPlusIcon from "@/features/my-properties/components/my-property-plus-icon";
import {
  MY_PROPERTY_EJAR_LOGO,
  type MyPropertyActionIconType,
} from "@/features/my-properties/data/my-property-actions-config";
import CustomIcon from "@/features/shared/components/custom-icon";
import { PlusCircle } from "lucide-react";

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
      return <PlusCircle/>;
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
        size={22}
        className="shrink-0 text-brand"
      />
    );
  }

  return (
    <Link
      href={href}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#f0f7f6] px-5 text-sm font-bold text-brand transition-colors hover:bg-[#e4f2ef]"
    >
      <span className="text-start leading-6">{label}</span>
      {renderIcon()}
    </Link>
  );
}
