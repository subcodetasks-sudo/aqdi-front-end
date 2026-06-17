import { Headphones, Mail } from "lucide-react";

type FooterSupportColumnProps = {
  title: string;
  phone: string;
  weekdaysHours: string;
  saturdayHours: string;
  email: string;
};

export default function FooterSupportColumn({
  title,
  phone,
  weekdaysHours,
  saturdayHours,
  email,
}: FooterSupportColumnProps) {
  return (
    <div className="space-y-4 lg:col-span-2">
      <h3 className="text-base font-bold text-brand">{title}</h3>

      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Headphones className="size-4 text-brand" aria-hidden="true" />
          <span dir="ltr">{phone}</span>
        </p>
<div className="space-y-2 py-2 border-t border-b ">

        <p className="text-sm leading-6 text-muted-foreground">{weekdaysHours}</p>
        <p className="text-sm leading-6 text-muted-foreground">{saturdayHours}</p>
</div>

        <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="size-4 text-brand" aria-hidden="true" />
          <span>{email}</span>
        </p>
      </div>
    </div>
  );
}
