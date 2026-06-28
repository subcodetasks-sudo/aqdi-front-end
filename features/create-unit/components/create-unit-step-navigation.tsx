import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";

type CreateUnitStepNavigationProps = {
  previousLabel: string;
  continueLabel: string;
  canContinue: boolean;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onContinue: () => void;
};

export default function CreateUnitStepNavigation({
  previousLabel,
  continueLabel,
  canContinue,
  isSubmitting = false,
  onPrevious,
  onContinue,
}: CreateUnitStepNavigationProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        onClick={onPrevious}
        disabled={isSubmitting}
        className="h-12 shrink-0 rounded-xl bg-[#666666] px-5 text-sm font-semibold text-white hover:bg-[#555555]"
      >
        <ChevronLeft className="size-4 -rotate-180" aria-hidden="true" />
        {previousLabel}
      </Button>

      <Button
        type="button"
        onClick={onContinue}
        disabled={!canContinue || isSubmitting}
        className={cn(
          "h-12 flex-1 rounded-xl text-base font-extrabold",
          canContinue && !isSubmitting
            ? "bg-linear-to-br from-brand-secondary via-brand to-brand text-white hover:opacity-90"
            : "bg-white text-[#bdbdbd] shadow-sm",
        )}
      >
        <CustomIcon src="/icons/arrow-r.svg" size={24} />
        {continueLabel}
        <CustomIcon src="/icons/arrow-l.svg" size={24} />
      </Button>
    </div>
  );
}
