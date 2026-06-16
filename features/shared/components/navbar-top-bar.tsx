import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import CustomIcon from "@/features/shared/components/custom-icon";

type NavbarTopBarProps = {
  aboutUs: string;
  blog: string;
  faq: string;
  httpsSecurity: string;
  httpfor: string;
  officialLinks: string;
  endWith: string;
  whatsappService: string;
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
}: NavbarTopBarProps) {
  const linkClassName =
    "text-black font-bold transition-colors hover:text-brand";

  return (
    <div className="hidden w-full lg:block">
      <div className=" flex  items-center justify-between  gap-y-2 py-2.5 text-sm ">
        <div className="flex  items-center 2xl:gap-x-5 gap-x-2 gap-y-1">
          <Link href="/about" className={linkClassName}>
            {aboutUs}
          </Link>
          <Link href="/blog" className={linkClassName}>
            {blog}
          </Link>
          <Link href="/faq" className={linkClassName}>
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
