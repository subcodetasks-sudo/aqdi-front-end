import AdvantageCard from "@/features/advantages/components/advantage-card";
import AdvantagesAppDownload from "@/features/advantages/components/advantages-app-download";
import AdvantagesHeader from "@/features/advantages/components/advantages-header";
import type { HomeFeaturesResolved } from "@/features/home/types/home-content";

type AdvantagesSectionProps = {
  content: HomeFeaturesResolved;
};

export default function AdvantagesSection({ content }: AdvantagesSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="container space-y-6 md:space-y-14">
        <AdvantagesHeader
          badge={content.badge}
          titlePrefix={content.titlePrefix}
          titleAccent={content.titleAccent}
          titleSuffix={content.titleSuffix}
          description={content.description}
        />

        <div className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border/60 py-6 border-b border-t  border-border/60 ">
          {content.cards.map((item) => (
            <AdvantageCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              theme={item.theme}
            />
          ))}
        </div>

        <AdvantagesAppDownload />
      </div>
    </section>
  );
}
