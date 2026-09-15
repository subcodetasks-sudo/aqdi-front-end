import { Smartphone } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function MobileAppLable() {
  const t = await getTranslations("hero");

  return (
    <div className="flex items-center gap-2">
      <Smartphone className="size-4 shrink-0 text-foreground" aria-hidden="true" />
      <p className="text-sm font-bold text-black">{t("downloadApp")}</p>
      <div className="h-[3px] w-6 bg-black" />
    </div>
  );
}
