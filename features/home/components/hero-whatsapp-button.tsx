import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

type HeroWhatsappButtonProps = {
  label: string;
  href?: string;
};

export default function HeroWhatsappButton({
  label,
  href = "https://wa.me/",
}: HeroWhatsappButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-6 end-6 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 lg:absolute"
    >
      <FaWhatsapp className="size-7" aria-hidden="true" />
    </Link>
  );
}
