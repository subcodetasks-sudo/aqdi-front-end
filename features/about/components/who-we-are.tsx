import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";
import type { AboutHeroResolved } from "@/features/about/types/about-content";

type WhoWeAreProps = {
  content: AboutHeroResolved;
};

export default function WhoWeAre({ content }: WhoWeAreProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center md:gap-8">
          <p className="text-sm text-gray-400 font-semibold">{content.eyebrow}</p>

          <h1 className="text-4xl font-extrabold leading-relaxed text-brand md:text-5xl 2xl:text-6xl">
            <span className="block">{content.titleLine1}</span>
            {content.titleLine2 ? (
              <span className="block">{content.titleLine2}</span>
            ) : null}
          </h1>

          <p className="max-w-xl text-sm leading-8 text-gray-400 font-semibold md:text-base">
            {content.description}
          </p>

          <div className="flex flex-col items-center gap-5 pt-2">
            <MobileAppLable />
            <MobileAppBtns />
          </div>
        </div>
      </div>
    </section>
  );
}
