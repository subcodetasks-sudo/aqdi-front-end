import type { ReactNode } from "react";

type UserSheetSectionCardProps = {
  title: string;
  children: ReactNode;
};

export default function UserSheetSectionCard({
  title,
  children,
}: UserSheetSectionCardProps) {
  return (
    <section className="rounded-2xl bg-brand-background p-4">
      <h3 className="mb-3 text-sm font-bold text-brand-secondary">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
