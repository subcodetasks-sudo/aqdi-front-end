"use client"

import NavbarMain from "@/features/shared/components/navbar-main";
import NavbarTopBar from "@/features/shared/components/navbar-top-bar";
import type { StartWithAqdiDialogLabels } from "@/features/start-with-aqdi/types/start-with-aqdi-dialog-labels";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavbarProps = {
  dialogLabels: StartWithAqdiDialogLabels;
};

export default function Navbar({ dialogLabels }: NavbarProps) {
  const t = useTranslations("navbar");
  const pathname = usePathname();
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  if(typeof window !== "undefined") {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }
}, []);


  return (
    <header className={cn("m-2 lg:m-4  mb-0!   bg-brand-background-green   py-4 overflow-hidden sticky lg:top-4 top-2 z-50", scrolled && "rounded-3xl! top-0 lg:top-0",
      pathname === "/" ? "rounded-t-3xl lg:rounded-t-[80px]" : "rounded-3xl"
    )}>
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
        scrolled={scrolled}
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
        dialogLabels={dialogLabels}
      />
        </div>
    </header>
  );
}
