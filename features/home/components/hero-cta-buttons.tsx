import HeroCtaButton from "@/features/home/components/hero-cta-button";

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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
      <div className="flex flex-1 flex-col items-center gap-2">
        <HeroCtaButton
          label={residentialCta}
          iconSrc="/icons/housing.svg"
          featured
        />
        <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-brand">
          <span aria-hidden="true">🔥</span>
          {mostRequested}
          <span aria-hidden="true">✨</span>
        </p>
      </div>

      <div className="flex-1">
        <HeroCtaButton
          label={commercialCta}
          iconSrc="/icons/commercial.svg"
        />
      </div>
    </div>
  );
}
