import { getTranslations } from "next-intl/server";

import NavbarLogo from "@/features/shared/components/navbar-logo";
import Image from "next/image";

type FooterBrandProps = {
  description: string;
};

export default async function FooterBrand({ description }: FooterBrandProps) {
  const t = await getTranslations("navbar.brand");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Image src="/images/logo.png" alt="logo" width={100} height={100} className="w-16 object-contain shrink-0" />
        <div className="space-y-2">
          <p className="text-4xl font-extrabold text-brand">{t("name")}</p>
          <p className=" text-gray-600 font-medium">{t("tagline")}...</p>
        </div>
      </div>
      <p className="max-w-sm text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
