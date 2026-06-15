"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, Menu, User, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  iconSrc: string;
  external?: boolean;
};

type NavbarMobileSheetProps = {
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
};

export default function NavbarMobileSheet({
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
}: NavbarMobileSheetProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/", label: home, iconSrc: "/icons/home.svg" },
    { href: "/properties", label: myProperties, iconSrc: "/icons/lable.svg" },
    { href: "/requests", label: requests, iconSrc: "/icons/bag.svg" },
    {
      href: "/app",
      label: downloadApp,
      iconSrc: "/icons/app.svg",
      external: true,
    },
  ];

  const topLinkClassName =
    "text-base font-bold text-black transition-colors hover:text-brand";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button

          size="icon-lg"
          className="rounded-full  text-white bg-brand hover:border-brand/30  lg:hidden"
          aria-label={menu}
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-y-auto p-4"
        showCloseButton={false}
      >
        <SheetHeader className="border-b border-border/60 pb-4 flex flex-row items-center justify-between">
          <SheetTitle className="sr-only">{menu}</SheetTitle>
          <div className="flex items-center gap-3 pe-8">
            <Image
              src="/images/logo.png"
              alt=""
              width={32}
              height={32}
              className="w-10 object-contain"
              aria-hidden="true"
            />
            <div className="min-w-0 space-y-1">
              <p className="text-xl font-bold text-brand">{brandName}</p>
              <p className="truncate text-sm text-gray-600 font-medium">{brandTagline}</p>
            </div>
          </div>
          <SheetClose className="bg-brand text-white size-7 flex items-center justify-center rounded-full ">
            <X className="size-4" aria-hidden="true" />
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">

          <nav aria-label="Main navigation" className="flex flex-col gap-4">
            {navItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 font-bold transition-colors hover:text-brand text-base",
                    pathname === item.href ? "text-brand" : "text-black"
                  )}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="inline-flex size-4 shrink-0 items-center justify-center">
                    <CustomIcon src={item.iconSrc} size={16} />
                  </span>
                  <span className="leading-none">{item.label}</span>
                  {item.external ? (
                    <ArrowUpLeft
                      className="size-4 text-brand-secondary"
                      aria-hidden="true"
                    />
                  ) : null}
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <SheetClose asChild>
              <Link href="/about" className={topLinkClassName}>
                {aboutUs}
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/blog" className={topLinkClassName}>
                {blog}
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/faq" className={topLinkClassName}>
                {faq}
              </Link>
            </SheetClose>
          </div>

        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-4">
          <Button
            variant="outline"
            className="h-12 w-full rounded-full border-border/80 text-muted-foreground hover:border-brand/30 hover:text-brand"
            aria-label={profile}
          >
            <CustomIcon src="/icons/user.svg" size={16} />
            <span className="leading-none">{profile}</span>
          </Button>

          <Button className="group h-12 w-full gap-3 rounded-full bg-brand px-5 pe-2 text-sm font-semibold text-white hover:bg-brand/90">
            <span>{cta}</span>
            <span className="flex size-7 items-center justify-center rounded-full bg-white text-brand">
              <ArrowUpLeft
                className="size-4 transition-transform duration-300 group-hover:-rotate-45"
                aria-hidden="true"
              />
            </span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
