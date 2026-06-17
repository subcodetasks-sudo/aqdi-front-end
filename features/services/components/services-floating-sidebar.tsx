import Link from "next/link";
import { FaApple, FaGooglePlay, FaWhatsapp } from "react-icons/fa";

type ServicesFloatingSidebarProps = {
  appleLabel: string;
  googlePlayLabel: string;
  whatsappLabel: string;
};

export default function ServicesFloatingSidebar({
  appleLabel,
  googlePlayLabel,
  whatsappLabel,
}: ServicesFloatingSidebarProps) {
  return (
    <div className="fixed bottom-[15%] z-40 flex  flex-col gap-3 inset-e-3 max-lg:hidden lg:inset-e-6">
      <Link
        href="https://apps.apple.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={appleLabel}
        className="flex size-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105"
      >
        <FaApple className="size-6" aria-hidden="true" />
      </Link>

      <Link
        href="https://play.google.com/store"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={googlePlayLabel}
        className="flex size-12 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-800 shadow-lg transition-transform hover:scale-105"
      >
        <FaGooglePlay className="size-5" aria-hidden="true" />
      </Link>

      <Link
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsappLabel}
        className="flex size-12 items-center justify-center rounded-full bg-brand-secondary text-white shadow-lg transition-transform hover:scale-105"
      >
        <FaWhatsapp className="size-6" aria-hidden="true" />
      </Link>
    </div>
  );
}
