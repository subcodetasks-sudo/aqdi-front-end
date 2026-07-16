import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";

type CreateContractStepNavigationProps = {
  previousLabel: string;
  continueLabel: string;
  saveLaterLabel?: string;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onContinue: () => void;
  onSaveLater?: () => void;
};

export default function CreateContractStepNavigation({
  previousLabel,
  continueLabel,
  saveLaterLabel,
  isSubmitting = false,
  onPrevious,
  onContinue,
  onSaveLater,
}: CreateContractStepNavigationProps) {
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

      {saveLaterLabel && onSaveLater ? (
        <Button
          type="button"
          onClick={onSaveLater}
          disabled={isSubmitting}
          className="h-12 shrink-0 gap-2 rounded-xl border border-brand-secondary bg-white px-3 text-xs font-semibold text-brand hover:bg-brand-background-green sm:px-4 sm:text-sm"
        >
          <CustomIcon
            src="/icons/file-write.svg"
            size={20}
            className="text-brand-secondary"
          />
          {saveLaterLabel}
        </Button>
      ) : null}

      <Button
        type="button"
        onClick={onContinue}
        disabled={isSubmitting}
        className="h-12 flex-1 rounded-xl bg-linear-to-br from-brand-secondary via-brand to-brand text-base font-extrabold text-white hover:opacity-90 disabled:opacity-70"
      >
        <CustomIcon src="/icons/arrow-r.svg" size={24} />
        {continueLabel}
        <CustomIcon src="/icons/arrow-l.svg" size={24} />
      </Button>
    </div>
  );
}
