import { Building2, IdCard, MapPin, User } from "lucide-react";

import CustomIcon from "@/features/shared/components/custom-icon";

type CreateContractStepPhaseHeaderProps = {
  title: string;
  subtitle: string;
  icon?: "check" | "building" | "location" | "id-card" | "user";
};

export default function CreateContractStepPhaseHeader({
  title,
  subtitle,
  icon = "check",
}: CreateContractStepPhaseHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-3 text-center">
      <span className="inline-flex text-brand-secondary">
        {icon === "location" ? (
          <MapPin className="size-6 text-brand-secondary" aria-hidden="true" />
        ) : icon === "building" ? (
          <Building2 className="size-6 text-brand-secondary" aria-hidden="true" />
        ) : icon === "id-card" ? (
          <IdCard className="size-6 text-brand-secondary" aria-hidden="true" />
        ) : icon === "user" ? (
          <User className="size-6 text-brand-secondary" aria-hidden="true" />
        ) : (
          <CustomIcon
            src="/icons/check.svg"
            size={24}
            className="text-brand-secondary"
          />
        )}
      </span>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-brand md:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-[#7f7f7f]">{subtitle}</p>
      </div>
    </div>
  );
}
