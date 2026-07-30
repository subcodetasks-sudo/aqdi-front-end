import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type CreatePropertyStepNavigationProps = {
  previousLabel: string;
  continueLabel: string;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onContinue: () => void;
};

export default function CreatePropertyStepNavigation({
  previousLabel,
  continueLabel,
  isSubmitting = false,
  onPrevious,
  onContinue,
}: CreatePropertyStepNavigationProps) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <Button
        type="button"
        onClick={onPrevious}
        disabled={isSubmitting}
        variant="outline"
        className="h-14 shrink-0 gap-1.5 rounded-2xl border-[#e4e4e4] bg-white px-5 text-sm font-semibold text-brand hover:bg-brand-background dark:border-[#2f403b] dark:bg-[#1a2421] dark:hover:bg-[#24302c]"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
        {previousLabel}
      </Button>

      <Button
        type="button"
        onClick={onContinue}
        disabled={isSubmitting}
        className="h-14 flex-1 rounded-2xl bg-linear-to-l from-brand-secondary to-brand text-base font-extrabold text-white hover:opacity-90 disabled:opacity-70"
      >
        {continueLabel}
      </Button>
    </div>
  );
}
