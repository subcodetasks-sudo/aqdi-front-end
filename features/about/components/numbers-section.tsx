import NumbersHeader from "@/features/about/components/numbers-header";
import NumbersStatCard from "@/features/about/components/numbers-stat-card";
import type { AboutStoryResolved } from "@/features/about/types/about-content";

type NumbersSectionProps = {
  content: AboutStoryResolved;
};

export default function NumbersSection({ content }: NumbersSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="container space-y-10 md:space-y-12">
        <NumbersHeader
          badge={content.badge}
          title={content.title}
          description={content.description}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {content.cards.map((stat) => (
            <NumbersStatCard
              key={stat.id}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
