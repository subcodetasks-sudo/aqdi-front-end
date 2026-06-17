import { getTranslations } from "next-intl/server";

import FooterBottomBar from "@/features/footer/components/footer-bottom-bar";
import FooterBrand from "@/features/footer/components/footer-brand";
import FooterLinksColumn from "@/features/footer/components/footer-links-column";
import FooterNewsletter from "@/features/footer/components/footer-newsletter";
import FooterSupportColumn from "@/features/footer/components/footer-support-column";
import FooterTopBar from "@/features/footer/components/footer-top-bar";

type FooterLinkItem = {
  label: string;
  href?: string;
};

export default async function Footer() {
  const t = await getTranslations("footer");

  const quickLinks = t.raw("quickLinks.items") as FooterLinkItem[];
  const importantLinks = t.raw("importantLinks.items") as FooterLinkItem[];
  const licenses = t.raw("licenses.items") as FooterLinkItem[];

  return (
    <footer className="border-t border-border/60 bg-white py-12 md:py-14">
      <div className="container space-y-10">
        <FooterTopBar
          followUs={t("followUs")}
          securePayments={t("securePayments")}
          paymentsAlt={t("paymentsAlt")}
        />

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-7 lg:gap-12">
          <div className="space-y-5 lg:col-span-2">
            <FooterBrand description={t("description")} />
            <FooterNewsletter
              placeholder={t("newsletterPlaceholder")}
              submitLabel={t("newsletterSubmit")}
            />
          </div>

          <FooterLinksColumn title={t("quickLinks.title")} items={quickLinks} />
          <FooterLinksColumn title={t("importantLinks.title")} items={importantLinks} />
          <FooterLinksColumn title={t("licenses.title")} items={licenses} />

          <FooterSupportColumn
            title={t("support.title")}
            phone={t("support.phone")}
            weekdaysHours={t("support.weekdaysHours")}
            saturdayHours={t("support.saturdayHours")}
            email={t("support.email")}
          />
        </div>

        <FooterBottomBar
          copyright={t("copyright")}
          terms={t("terms")}
          privacy={t("privacy")}
          termsHref={t("termsHref")}
          privacyHref={t("privacyHref")}
        />
      </div>
    </footer>
  );
}
