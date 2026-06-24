import Image from "next/image";
import { ArrowUpLeft } from "lucide-react";

type BlogSidebarStatsCardProps = {
  title: string;
  subtitle: string;
  description: string;
  statsHeading: string;
  activeUsers: string;
  activeUsersLabel: string;
  annualContracts: string;
  annualContractsLabel: string;
  leasedUnits: string;
  leasedUnitsLabel: string;
  logoAlt: string;
};

export default function BlogSidebarStatsCard({
  title,
  subtitle,
  description,
  statsHeading,
  activeUsers,
  activeUsersLabel,
  annualContracts,
  annualContractsLabel,
  leasedUnits,
  leasedUnitsLabel,
  logoAlt,
}: BlogSidebarStatsCardProps) {
  const stats = [
    { value: activeUsers, label: activeUsersLabel },
    { value: annualContracts, label: annualContractsLabel },
    { value: leasedUnits, label: leasedUnitsLabel },
  ];

  return (
    <div className="rounded-[32px] bg-brand p-6 text-white shadow-sm md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white p-2.5">
            <Image
              src="/images/logo.png"
              alt={logoAlt}
              width={28}
              height={28}
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="space-y-0.5 text-start">
            <h2 className="text-sm font-extrabold leading-tight">{title}</h2>
            <p className="text-[10px] font-medium text-white/75 md:text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        <ArrowUpLeft className="size-4 shrink-0 text-white/70" aria-hidden="true" />
      </div>

      <p className="mt-5 text-start text-sm leading-8 text-white/90 md:text-[15px] font-light">
        {description}
      </p>

      <div className="mt-6 border-t border-white/15 pt-6">
        <h3 className="mb-4 text-start text-sm font-semibold text-white">
          {statsHeading}
        </h3>

        <div className="grid grid-cols-3 divide-x divide-white/15">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1 px-2 text-center">
              <p className="text-xl font-extrabold text-brand-secondary md:text-2xl">
                {stat.value}
              </p>
              <p className="text-[11px] leading-5 text-white/80 md:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
