import { Rocket } from "lucide-react";

import HeroCtaButtons from "@/features/home/components/hero-cta-buttons";
import HeroFeatureList from "@/features/home/components/hero-feature-list";
import CustomIcon from "@/features/shared/components/custom-icon";

type HeroContentProps = {
  badge: string;
  titleLine1Accent: string;
  titleLine1Main: string;
  titleLine2Main: string;
  titleLine2Accent: string;
  description: string;
  features: string[];
  residentialCta: string;
  commercialCta: string;
  mostRequested: string;
};

export default function HeroContent({
  badge,
  titleLine1Accent,
  titleLine1Main,
  titleLine2Main,
  titleLine2Accent,
  description,
  features,
  residentialCta,
  commercialCta,
  mostRequested,
}: HeroContentProps) {
  return (
    <div className="order-2 flex flex-1 flex-col gap-6 py-4 lg:order-2 lg:py-8">
      <div className="flex w-fit items-center gap-2 rounded-full  bg-brand/10 p-2 text-sm font-bold text-brand shadow-sm">
        <div className="size-7 bg-brand rounded-full flex items-center justify-center">
          <CustomIcon src="/icons/file.svg" size={20} className="text-white" />
        </div>
        <span>{badge}</span>
        <span>🚀</span>
      </div>

      <div className="space-y-4">
        <h1 className="max-w-md text-3xl font-bold leading-tight sm:text-xl lg:text-[2.5rem] lg:leading-[1.15] 2xl:text-[4rem] space-y-1">
          <span className="block ">
            <span className="text-brand-secondary">{titleLine1Accent}</span>{" "}
            <span className="text-foreground">{titleLine1Main}</span>
          </span>
          <span className="block">
            <span className="text-foreground">{titleLine2Main}</span>{" "}
            <span className="text-brand-secondary">{titleLine2Accent}</span>
          </span>
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-black">
          {description}
        </p>
      </div>

      <HeroFeatureList features={features} />

      <HeroCtaButtons
        residentialCta={residentialCta}
        commercialCta={commercialCta}
        mostRequested={mostRequested}
      />
    </div>
  );
}
