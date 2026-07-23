import { Building2, CircleDollarSign, IdCard, MapPin, User, Wallet } from "lucide-react";

import CustomIcon from "@/features/shared/components/custom-icon";

type CreateContractStepPhaseHeaderProps = {
  title: string;
  subtitle: string;
  icon?: "check" | "building" | "location" | "id-card" | "user" | "dollar" | "payment";
  showIcon?: boolean;
};

export default function CreateContractStepPhaseHeader({
  title,
  subtitle,
  icon = "check",
  showIcon = true,
}: CreateContractStepPhaseHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-3 text-center">
      {showIcon ? (
        <span className="inline-flex text-brand-secondary">
          {icon === "location" ? (
            <MapPin className="size-6 text-brand-secondary" aria-hidden="true" />
          ) : icon === "building" ? (
            <Building2 className="size-6 text-brand-secondary" aria-hidden="true" />
          ) : icon === "id-card" ? (
            <IdCard className="size-6 text-brand-secondary" aria-hidden="true" />
          ) : icon === "user" ? (
            <User className="size-6 text-brand-secondary" aria-hidden="true" />
          ) : icon === "dollar" ? (
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-secondary text-white">
              <CircleDollarSign className="size-5" aria-hidden="true" />
            </span>
          ) : icon === "payment" ? (
            <Wallet className="size-6 text-brand-secondary" aria-hidden="true" />
          ) : (
            <CustomIcon
              src="/icons/check.svg"
              size={24}
              className="text-brand-secondary"
            />
          )}
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
