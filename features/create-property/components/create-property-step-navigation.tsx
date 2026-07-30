import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";

type CreatePropertyStepNavigationProps = {
  previousLabel: string;
  continueLabel: string;
  saveLabel?: string;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onContinue: () => void;
  onSave?: () => void;
};

export default function CreatePropertyStepNavigation({
  previousLabel,
  continueLabel,
  saveLabel,
  isSubmitting = false,
  onPrevious,
  onContinue,
  onSave,
}: CreatePropertyStepNavigationProps) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <Button
        type="button"
        onClick={onPrevious}
        disabled={isSubmitting}
        variant="outline"
        className="h-14 shrink-0 rounded-2xl border-[#e4e4e4] bg-white px-5 text-sm font-semibold text-brand hover:bg-brand-background dark:border-[#2f403b] dark:bg-[#1a2421] dark:hover:bg-[#24302c]"
      >
        {previousLabel}
      </Button>

      {saveLabel && onSave ? (
        <Button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          variant="outline"
          className="h-14 shrink-0 gap-2 rounded-2xl border-[#e4e4e4] bg-white px-3 text-xs font-semibold text-brand hover:bg-brand-background sm:px-4 sm:text-sm dark:border-[#2f403b] dark:bg-[#1a2421] dark:hover:bg-[#24302c]"
        >
          <CustomIcon
            src="/icons/file-write.svg"
            size={20}
            className="text-brand"
          />
          {saveLabel}
        </Button>
      ) : null}

      <Button
        type="button"
        onClick={onContinue}
        disabled={isSubmitting}
        className="h-14 flex-1 rounded-2xl bg-brand text-base font-extrabold text-white hover:opacity-90 disabled:opacity-70"
      >
        {continueLabel}
      </Button>
    </div>
  );
}
