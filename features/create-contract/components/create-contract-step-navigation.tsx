import { ChevronRight } from "lucide-react";

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
    <div className="mt-4 flex items-center gap-2 sm:gap-3">
      <Button
        type="button"
        onClick={onPrevious}
        disabled={isSubmitting}
        variant="outline"
        className="h-11 shrink-0 gap-1.5 rounded-2xl border-brand bg-white px-4 text-sm font-semibold text-brand hover:bg-brand-background sm:h-11 sm:px-5 dark:border-brand-secondary dark:bg-[#1a2421] dark:hover:bg-[#24302c]"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
        {previousLabel}
      </Button>

      {saveLaterLabel && onSaveLater ? (
        <Button
          type="button"
          onClick={onSaveLater}
          disabled={isSubmitting}
          variant="outline"
          className="h-11 shrink-0 gap-2 rounded-2xl border-brand-secondary bg-white px-3 text-xs font-semibold text-brand hover:bg-brand-background-green sm:h-11 sm:px-4 sm:text-sm dark:bg-[#1a2421] dark:hover:bg-[#24302c]"
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
        className="h-11 flex-1 rounded-2xl bg-brand text-base font-extrabold text-white hover:opacity-90 disabled:opacity-70 sm:h-11"
      >
        {continueLabel}
      </Button>
    </div>
  );
}
