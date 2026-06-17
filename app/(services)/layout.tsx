import FooterBottomBar from "@/features/footer/components/footer-bottom-bar";
import ServicesFloatingSidebar from "@/features/services/components/services-floating-sidebar";
import { getTranslations } from "next-intl/server";

export default async function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footer = await getTranslations("footer");
  const hero = await getTranslations("hero");

  return (
    <div className="flex min-h-screen flex-col bg-brand-background">
      <div className="relative flex-1">
        {children}
        <ServicesFloatingSidebar
          appleLabel={hero("appStore")}
          googlePlayLabel={hero("googlePlay")}
          whatsappLabel={hero("whatsapp")}
        />
      </div>
      <FooterBottomBar
        copyright={footer("copyright")}
        terms={footer("terms")}
        privacy={footer("privacy")}
        termsHref={footer("termsHref")}
        privacyHref={footer("privacyHref")}
        className="container pb-6 pt-8"
      />
    </div>
  );
}
