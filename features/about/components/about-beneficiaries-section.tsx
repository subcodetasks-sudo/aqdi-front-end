import { getTranslations } from "next-intl/server";

import AboutBeneficiaryCard from "@/features/about/components/about-beneficiary-card";
import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";

type BeneficiaryItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export default async function AboutBeneficiariesSection() {
  const t = await getTranslations("about.beneficiaries");
  const items = t.raw("items") as BeneficiaryItem[];

  return (
    <section className="bg-brand/10 py-16 md:py-20">
      <div className="container space-y-10 md:space-y-12">
        <header className="mx-auto  space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-brand-background-green px-4 py-1.5 text-sm font-bold text-foreground">
            {t("badge")}
          </span>
          <h2 className="text-4xl font-extrabold leading-tight text-brand md:text-5xl">
            {t("title")}
          </h2>
          <p className="text-sm leading-8 text-black md:text-base">
            {t("description")}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <AboutBeneficiaryCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-5">
          <MobileAppLable />
          <MobileAppBtns />
        </div>
      </div>
    </section>
  );
}
