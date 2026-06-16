import { getTranslations } from "next-intl/server";

import PricingCard from "@/features/pricing/components/pricing-card";

type PricingPlan = {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
};

export default async function PricingSection() {
  const t = await getTranslations("pricing");
  const plans = t.raw("plans") as PricingPlan[];

  return (
    <section className="py-16 md:py-20">
      <div className="container space-y-12">
        <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="rounded-full bg-brand-secondary/10 px-4 py-1.5 text-sm font-bold text-brand border">
            {t("badge")}
          </span>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl 2xl:text-5xl">
            <span className="text-foreground">{t("titlePrefix")}</span>
            <span className="text-brand-secondary">{t("titleAccent")}</span>
          </h2>
          <p className="text-sm leading-relaxed md:text-base">{t("description")}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              icon={plan.icon}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              benefitsTitle={t("benefitsTitle")}
              features={plan.features}
              cta={plan.cta}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
