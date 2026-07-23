import { Building2, IdCard, MapPin, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CreatePropertyStepPhaseHeaderProps = {
  title: string;
  subtitle: string;
  icon?: "building" | "location" | "id-card" | "tag";
  showIcon?: boolean;
};

const HEADER_ICONS: Record<
  NonNullable<CreatePropertyStepPhaseHeaderProps["icon"]>,
  LucideIcon
> = {
  building: Building2,
  location: MapPin,
  "id-card": IdCard,
  tag: Tag,
};

export default function CreatePropertyStepPhaseHeader({
  title,
  subtitle,
  icon = "building",
  showIcon = true,
}: CreatePropertyStepPhaseHeaderProps) {
  const Icon = HEADER_ICONS[icon];

  return (
    <div className="mb-8 flex flex-col items-center gap-3 text-center">
      {showIcon ? (
        <span className="inline-flex text-brand-secondary">
          <Icon className="size-6 text-brand-secondary" aria-hidden="true" />
        </span>
      ) : null}

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-brand md:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-[#7f7f7f]">{subtitle}</p>
      </div>
    </div>
  );
}
