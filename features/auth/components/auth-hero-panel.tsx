import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function AuthHeroPanel() {
  const t = await getTranslations("auth.hero");

  return (
    <aside className="relative hidden min-h-screen overflow-hidden   lg:block col-span-3">
      <Image
        src="/images/hero.png"
        alt={t("imageAlt")}
        fill
        priority
        className="object-contain object-center"
        sizes="50vw"
      />
    </aside>
  );
}
