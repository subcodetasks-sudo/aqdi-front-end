import Image from "next/image";

type FooterPaymentMethodsProps = {
  label: string;
  imageAlt: string;
};

export default function FooterPaymentMethods({
  label,
  imageAlt,
}: FooterPaymentMethodsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <div className="h-[3px] w-6 bg-foreground" />
      </div>

      <Image
        src="/images/payments.png"
        alt={imageAlt}
        width={320}
        height={40}
        className="h-6 w-auto object-contain"
      />
    </div>
  );
}
