"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import CustomIcon from "@/features/shared/components/custom-icon";

export default function MyPropertiesAddButton() {
  const t = useTranslations("myProperties");

  return (
    <Link
      href="/properties/create"
      className="flex h-14 w-full max-w-xl items-center justify-between rounded-full bg-linear-to-l from-brand-secondary to-brand px-4 text-base font-bold text-white transition-opacity hover:opacity-90"
    >
      <CustomIcon src="/icons/arrow-r.svg" size={28} />
      <span>{t("addProperty")}</span>
      <CustomIcon src="/icons/arrow-l.svg" size={28} />
    </Link>
  );
}
