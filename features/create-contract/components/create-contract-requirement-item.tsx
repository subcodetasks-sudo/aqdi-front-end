import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CreateContractRequirementItemProps = {
  text: string;
  icon: LucideIcon;
  className?: string;
};

export default function CreateContractRequirementItem({
  text,
  icon: Icon,
  className,
}: CreateContractRequirementItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-[#ececec] py-2 last:border-b-0",
        className,
      )}
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center text-brand-secondary">
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <p className="flex-1  font-medium text-[#333333]">{text}</p>
    </div>
  );
}
