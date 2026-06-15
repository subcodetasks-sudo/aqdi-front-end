import { getTranslations } from "next-intl/server";

import NavbarMain from "@/features/shared/components/navbar-main";
import NavbarTopBar from "@/features/shared/components/navbar-top-bar";

export default async function Navbar() {
  const t = await getTranslations("navbar");

  return (
    <header className="">
        <div className="container">

      <NavbarTopBar
        aboutUs={t("topBar.aboutUs")}
        blog={t("topBar.blog")}
        faq={t("topBar.faq")}
        httpsSecurity={t("topBar.httpsSecurity")}
        httpfor={t("topBar.httpfor")}
        officialLinks={t("topBar.officialLinks")}
        endWith={t("topBar.endWith")}
        whatsappService={t("topBar.whatsappService")}
      />
      <NavbarMain
        aboutUs={t("topBar.aboutUs")}
        blog={t("topBar.blog")}
        faq={t("topBar.faq")}
        httpsSecurity={t("topBar.httpsSecurity")}
        httpfor={t("topBar.httpfor")}
        officialLinks={t("topBar.officialLinks")}
        endWith={t("topBar.endWith")}
        whatsappService={t("topBar.whatsappService")}
        brandName={t("brand.name")}
        brandTagline={t("brand.tagline")}
        home={t("nav.home")}
        myProperties={t("nav.myProperties")}
        requests={t("nav.requests")}
        downloadApp={t("nav.downloadApp")}
        cta={t("cta")}
        profile={t("profile")}
        menu={t("menu")}
      />
        </div>
    </header>
  );
}
