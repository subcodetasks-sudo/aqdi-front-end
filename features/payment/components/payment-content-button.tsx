import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PaymentContentButton } from "@/features/payment/types/payment-content";

type PaymentContentActionButtonProps = {
  button: PaymentContentButton;
  variant?: "primary" | "secondary";
};

export default function PaymentContentActionButton({
  button,
  variant = "primary",
}: PaymentContentActionButtonProps) {
  const isExternal = /^https?:\/\//i.test(button.href);

  const className =
    variant === "primary"
      ? "h-12 w-full rounded-xl bg-linear-to-br from-brand-secondary via-brand to-brand text-sm font-bold text-white hover:opacity-90"
      : "h-12 w-full rounded-xl border-[#e8e8e8] bg-white text-sm font-bold text-brand hover:bg-brand-background";

  if (isExternal) {
    return (
      <Button asChild className={className} variant={variant === "primary" ? "default" : "outline"}>
        <a href={button.href} target="_blank" rel="noopener noreferrer">
          {button.text}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild className={className} variant={variant === "primary" ? "default" : "outline"}>
      <Link href={button.href}>{button.text}</Link>
    </Button>
  );
}
