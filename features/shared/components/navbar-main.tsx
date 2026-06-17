import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpLeft, User } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomIcon from "@/features/shared/components/custom-icon";
import NavbarMobileSheet from "@/features/shared/components/navbar-mobile-sheet";
import NavbarNavLink from "@/features/shared/components/navbar-nav-link";
import StartWithAqdiDialog from "@/features/start-with-aqdi/components/start-with-aqdi-dialog";
import type { StartWithAqdiDialogLabels } from "@/features/start-with-aqdi/types/start-with-aqdi-dialog-labels";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
};

type NavbarMainProps = {
  aboutUs: string;
  blog: string;
  faq: string;
  httpsSecurity: string;
  httpfor: string;
  officialLinks: string;
  endWith: string;
  whatsappService: string;
  brandName: string;
  brandTagline: string;
  home: string;
  myProperties: string;
  requests: string;
  downloadApp: string;
  cta: string;
  profile: string;
  menu: string;
  dialogLabels: StartWithAqdiDialogLabels;
};

export default function NavbarMain({
  aboutUs,
  blog,
  faq,
  httpsSecurity,
  httpfor,
  officialLinks,
  endWith,
  whatsappService,
  brandName,
  brandTagline,
  home,
  myProperties,
  requests,
  downloadApp,
  cta,
  profile,
  menu,
  dialogLabels,
}: NavbarMainProps) {
  const navItems: NavItem[] = [
    {
      href: "/",
      label: home,
      icon: <CustomIcon src="/icons/home.svg" size={16} />,
    },
    {
      href: "/properties",
      label: myProperties,
      icon: <CustomIcon src="/icons/lable.svg" size={16} />,
    },
    {
      href: "/requests",
      label: requests,
      icon: <CustomIcon src="/icons/bag.svg" size={16} />,
    },
    {
      href: "/app",
      label: downloadApp,
      icon: <CustomIcon src="/icons/app.svg" size={16} />,
      external: true,
    },
  ];

  return (
    <div className="lg:py-4">
      <div
        className={cn(
          "flex items-center justify-between gap-4 lg:rounded-full rounded-2xl bg-white px-5 py-3",
          "md:px-8 md:py-4",
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/logo.png"
            alt=""
            width={100}
            height={100}
            className="w-8 object-contain"
            aria-hidden="true"
          />
          <div className="min-w-0 space-y-1">
            <p className="text-xl font-bold leading-tight text-brand">
              {brandName}
            </p>
            <p className="truncate text-sm font-medium text-gray-600">
              {brandTagline}
            </p>
          </div>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8"
        >
          {navItems.map((item) => (
            <NavbarNavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login">
            <Button
              variant="outline"
              className="size-12 rounded-full border-border/80 text-muted-foreground hover:border-brand/30 hover:text-brand"
              aria-label={profile}
            >
              <CustomIcon src="/icons/user.svg" size={16} />
            </Button>
          </Link>
          <StartWithAqdiDialog labels={dialogLabels}>
            <Button className="group h-12 gap-3 rounded-full bg-brand px-5 pe-2 text-sm font-semibold text-white hover:bg-brand/90">
              <span>{cta}</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-white text-brand">
                <ArrowUpLeft
                  className="size-4 transition-transform duration-300 group-hover:-rotate-45"
                  aria-hidden="true"
                />
              </span>
            </Button>
          </StartWithAqdiDialog>
        </div>

        <NavbarMobileSheet
          aboutUs={aboutUs}
          blog={blog}
          faq={faq}
          httpsSecurity={httpsSecurity}
          httpfor={httpfor}
          officialLinks={officialLinks}
          endWith={endWith}
          whatsappService={whatsappService}
          brandName={brandName}
          brandTagline={brandTagline}
          home={home}
          myProperties={myProperties}
          requests={requests}
          downloadApp={downloadApp}
          cta={cta}
          profile={profile}
          menu={menu}
          dialogLabels={dialogLabels}
        />
      </div>
    </div>
  );
}
