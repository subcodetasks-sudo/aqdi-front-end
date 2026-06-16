import Link from "next/link";
import { FaInstagram, FaSnapchatGhost, FaTiktok } from "react-icons/fa";

type FooterSocialLinksProps = {
  label: string;
};

const socialLinks = [
  { href: "#", icon: FaSnapchatGhost, label: "Snapchat" },
  { href: "#", icon: FaInstagram, label: "Instagram" },
  { href: "#", icon: FaTiktok, label: "TikTok" },
] as const;

export default function FooterSocialLinks({ label }: FooterSocialLinksProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <div className="h-[3px] w-6 bg-foreground" />
      </div>

      <div className="flex items-center gap-2">
        {socialLinks.map(({ href, icon: Icon, label: iconLabel }) => (
          <Link
            key={iconLabel}
            href={href}
            aria-label={iconLabel}
            className="inline-flex size-9 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand/90"
          >
            <Icon className="size-4" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
