import Link from "next/link";
import { FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

type UserSheetSocialBarProps = {
  followUs: string;
  youtubeLabel: string;
  twitterLabel: string;
  tiktokLabel: string;
};

const socialLinks = [
  { href: "#", icon: FaYoutube, labelKey: "youtube" as const },
  { href: "#", icon: FaXTwitter, labelKey: "twitter" as const },
  { href: "#", icon: FaTiktok, labelKey: "tiktok" as const },
] as const;

export default function UserSheetSocialBar({
  followUs,
  youtubeLabel,
  twitterLabel,
  tiktokLabel,
}: UserSheetSocialBarProps) {
  const labels = {
    youtube: youtubeLabel,
    twitter: twitterLabel,
    tiktok: tiktokLabel,
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-full bg-brand-background px-4 py-3">
      <p className="text-sm font-bold text-foreground">{followUs}</p>

      <div className="flex items-center gap-2">
        {socialLinks.map(({ href, icon: Icon, labelKey }) => (
          <Link
            key={labelKey}
            href={href}
            aria-label={labels[labelKey]}
            className="inline-flex size-9 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand/90"
          >
            <Icon className="size-4" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
