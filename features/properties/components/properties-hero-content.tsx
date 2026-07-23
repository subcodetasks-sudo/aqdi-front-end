import CustomIcon from "@/features/shared/components/custom-icon";
import PropertiesAppDownload from "@/features/properties/components/properties-app-download";
import PropertiesCtaButton from "@/features/properties/components/properties-cta-button";

type PropertiesHeroContentProps = {
  badge: string;
  titleAccent: string;
  titleMain: string;
  description: string;
  cta: string;
};

export default function PropertiesHeroContent({
  badge,
  titleAccent,
  titleMain,
  description,
  cta,
}: PropertiesHeroContentProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-8">
      <div className="flex w-fit items-center gap-2 rounded-full bg-brand/10 p-2 text-sm font-bold text-brand shadow-sm">
        <div className="flex size-7 items-center justify-center rounded-full bg-brand">
          <CustomIcon src="/icons/file.svg" size={20} className="text-white" />
        </div>
        <span>{badge}</span>
      </div>

      <div className="space-y-4">
        <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15] 2xl:text-[3.25rem]">
          <span className="text-brand-secondary">{titleAccent}</span>
          <span className="text-foreground block">{titleMain}</span>
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-black/80">
          {description}
        </p>
      </div>

      <PropertiesCtaButton label={cta} />
      <PropertiesAppDownload />
    </div>
  );
}
