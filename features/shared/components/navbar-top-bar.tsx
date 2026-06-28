"use client"
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import CustomIcon from "@/features/shared/components/custom-icon";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavbarTopBarProps = {
  aboutUs: string;
  blog: string;
  faq: string;
  httpsSecurity: string;
  httpfor: string;
  officialLinks: string;
  endWith: string;
  whatsappService: string;
  scrolled: boolean;
};

export default function NavbarTopBar({
  aboutUs,
  blog,
  faq,
  httpsSecurity,
  officialLinks,
  whatsappService,
  httpfor,
  endWith,
  scrolled,
}: NavbarTopBarProps) {
  const linkClassName =
    "text-black font-bold transition-colors hover:text-brand " ;

    const pathname = usePathname();

  return (
    <div
      className={cn(
        "hidden w-full overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out lg:block",
        scrolled ? "max-h-0 opacity-0 pointer-events-none" : "max-h-20 opacity-100",
      )}
    >
      <div className=" flex  items-center justify-between  gap-y-2 py-2.5 text-sm ">
        <div className="flex  items-center 2xl:gap-x-5 gap-x-2 gap-y-1">
          <Link href="/about" className={cn(linkClassName, pathname === "/about" ? "text-brand" : "")}>
            {aboutUs}
          </Link>
          <a href="https://blogs.aqdi.sa/" className={cn(linkClassName, pathname === "/blog" ? "text-brand" : "")}>
            {blog}
          </a>
          <Link href="/faq" className={cn(linkClassName, pathname === "/faq" ? "text-brand" : "")}>
            {faq}
          </Link>
        </div>

        <div className="flex  items-center 2xl:gap-x-5 gap-x-2 gap-y-2">
          <span className="inline-flex items-center gap-1.5 text-brand-secondary font-bold">
            <CustomIcon
              src="/icons/lock.svg"
              size={14}
              className="text-brand transition-colors"
            />
            {httpsSecurity}
            <span className="text-black">
            {httpfor}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-brand-secondary font-bold">
            <CustomIcon
              src="/icons/link.svg"
              size={14}
              className="text-brand  "
            />
            {officialLinks}
            <span className="text-black">
            {endWith}
            </span>
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5  font-bold text-gray-600">
          {whatsappService}
          <FaWhatsapp className="size-6 shrink-0 text-green-500" />
        </span>
      </div>
    </div>
  );
}
