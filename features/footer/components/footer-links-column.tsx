import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type FooterLinkItem = {
  label: string;
  href?: string;
};

type FooterLinksColumnProps = {
  title: string;
  items: FooterLinkItem[];
};

export default function FooterLinksColumn({ title, items }: FooterLinksColumnProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-brand">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 text-sm text-foreground transition hover:text-brand"
              >
                <ChevronLeft className="size-3.5 text-brand" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-foreground">
                <ChevronLeft className="size-3.5 text-brand" aria-hidden="true" />
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
