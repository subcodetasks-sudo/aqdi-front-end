"use client";

import HeroCtaButton from "@/features/home/components/hero-cta-button";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";
import Link from "next/link";

type HeroCtaButtonsProps = {
  residentialCta: string;
  commercialCta: string;
  mostRequested: string;
};

export default function HeroCtaButtons({
  residentialCta,
  commercialCta,
  mostRequested,
}: HeroCtaButtonsProps) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
        <Link
          href="/create-contract?id=residential"
          className="w-full"
          onClick={resetCreateContractDraft}
        >
          <HeroCtaButton
            label={residentialCta}
            iconSrc="/icons/housing.svg"
            featured
          />
        </Link>
        <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-brand">
          <span aria-hidden="true">🔥</span>
          {mostRequested}
          <span aria-hidden="true">✨</span>
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href="/create-contract?id=commercial"
          className="w-full"
          onClick={resetCreateContractDraft}
        >
          <HeroCtaButton
            label={commercialCta}
            iconSrc="/icons/commercial.svg"
          />
        </Link>
      </div>
    </div>
  );
}
