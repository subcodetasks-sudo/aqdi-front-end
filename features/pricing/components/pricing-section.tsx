import PricingCard from "@/features/pricing/components/pricing-card";
import type { HomePricingResolved } from "@/features/home/types/home-content";

type PricingSectionProps = {
  content: HomePricingResolved;
};

export default function PricingSection({ content }: PricingSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="container space-y-12">
        <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="rounded-full bg-brand-secondary/10 px-4 py-1.5 text-sm font-bold text-brand border">
            {content.badge}
          </span>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl 2xl:text-5xl">
            <span className="text-foreground">{content.titlePrefix}</span>
            {content.titleAccent ? (
              <span className="text-brand-secondary">{content.titleAccent}</span>
            ) : null}
          </h2>
          <p className="text-sm leading-relaxed md:text-base">
            {content.description}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {content.plans.map((plan) => (
            <PricingCard
              key={plan.id}
              icon={plan.icon}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              benefitsTitle={content.benefitsTitle}
              features={plan.features}
              cta={plan.cta}
              id={plan.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
