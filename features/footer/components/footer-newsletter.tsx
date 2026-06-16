import { ArrowLeft, Mail } from "lucide-react";

import { Input } from "@/components/ui/input";

type FooterNewsletterProps = {
  placeholder: string;
};

export default function FooterNewsletter({ placeholder }: FooterNewsletterProps) {
  return (
    <form className="relative w-full">
      <Input
        type="email"
        placeholder={placeholder}
        className="h-12 rounded border-[#e5e5e5] bg-brand-background pe-11 ps-10 text-sm"
      />
      <Mail
        className="pointer-events-none absolute inset-s-4 top-1/2 size-4 -translate-y-1/2 text-black"
        aria-hidden="true"
      />
      <button
        type="submit"
        className="absolute inset-e-1.5 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded bg-brand-secondary text-brand transition hover:bg-brand/90 hover:text-white"
        aria-label={placeholder}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
