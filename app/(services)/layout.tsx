import FooterBottomBar from "@/features/footer/components/footer-bottom-bar";
import ServicesFloatingSidebar from "@/features/services/components/services-floating-sidebar";
import { ServicesPageProvider } from "@/features/services/components/services-page-provider";
import ServicesSideBackNav from "@/features/services/components/services-side-back-nav";
import { getTranslations } from "next-intl/server";

export default async function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footer = await getTranslations("footer");
  const hero = await getTranslations("hero");

  return (
    <div
      data-services-layout
      className="flex min-h-screen flex-col bg-brand-background"
    >
      <ServicesPageProvider>
        <div className="relative flex-1">
          <div className="container pt-4 pb-8 lg:pb-10">
            <ServicesSideBackNav />
            <main className="mx-auto w-full">{children}</main>
          </div>

          <ServicesFloatingSidebar
            appleLabel={hero("appStore")}
            googlePlayLabel={hero("googlePlay")}
            whatsappLabel={hero("whatsapp")}
          />
        </div>
      </ServicesPageProvider>

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
