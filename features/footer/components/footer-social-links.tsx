import Link from "next/link";
import { FaSnapchatGhost } from "react-icons/fa";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";

import type { FooterSocialLink } from "@/features/settings/utils/resolve-footer-contact";

type FooterSocialLinksProps = {
  label: string;
  links: FooterSocialLink[];
};

const SOCIAL_ICONS = {
  snapchat: FaSnapchatGhost,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  twitter: FaXTwitter,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
} as const;

export default function FooterSocialLinks({
  label,
  links,
}: FooterSocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <div className="h-[3px] w-6 bg-foreground" />
      </div>

      <div className="flex items-center gap-2">
        {links.map(({ id, href, label: iconLabel }) => {
          const Icon = SOCIAL_ICONS[id as keyof typeof SOCIAL_ICONS];
          if (!Icon) {
            return null;
          }

          return (
            <Link
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={iconLabel}
              className="inline-flex size-9 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand/90"
            >
              <Icon className="size-4" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
