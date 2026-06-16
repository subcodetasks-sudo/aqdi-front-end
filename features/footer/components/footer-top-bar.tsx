import FooterPaymentMethods from "@/features/footer/components/footer-payment-methods";
import FooterSocialLinks from "@/features/footer/components/footer-social-links";

type FooterTopBarProps = {
  followUs: string;
  securePayments: string;
  paymentsAlt: string;
};

export default function FooterTopBar({
  followUs,
  securePayments,
  paymentsAlt,
}: FooterTopBarProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 border-b border-border/70 pb-8 md:flex-row md:items-center">
      <FooterSocialLinks label={followUs} />
      <FooterPaymentMethods label={securePayments} imageAlt={paymentsAlt} />
    </div>
  );
}
