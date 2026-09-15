import FooterPaymentMethods from "@/features/footer/components/footer-payment-methods";
import FooterSocialLinks from "@/features/footer/components/footer-social-links";
import type { FooterSocialLink } from "@/features/settings/utils/resolve-footer-contact";

type FooterTopBarProps = {
  followUs: string;
  securePayments: string;
  paymentsAlt: string;
  socialLinks: FooterSocialLink[];
};

export default function FooterTopBar({
  followUs,
  securePayments,
  paymentsAlt,
  socialLinks,
}: FooterTopBarProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 border-b border-border/70 pb-8 md:flex-row md:items-center">
      <FooterSocialLinks label={followUs} links={socialLinks} />
      <FooterPaymentMethods label={securePayments} imageAlt={paymentsAlt} />
    </div>
  );
}
