import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";

type CreateContractPaymentNavigationProps = {
  previousLabel: string;
  payLabel: string;
  payingLabel?: string;
  saveLabel?: string;
  isPaying?: boolean;
  isSaving?: boolean;
  onPrevious: () => void;
  onPay: () => void;
  onSave?: () => void;
};

export default function CreateContractPaymentNavigation({
  previousLabel,
  payLabel,
  payingLabel,
  saveLabel,
  isPaying = false,
  isSaving = false,
  onPrevious,
  onPay,
  onSave,
}: CreateContractPaymentNavigationProps) {
  const busy = isPaying || isSaving;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onPrevious}
          disabled={busy}
          className="h-12 shrink-0 rounded-xl bg-[#666666] px-5 text-sm font-semibold text-white hover:bg-[#555555] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ChevronLeft className="size-4 -rotate-180" aria-hidden="true" />
          {previousLabel}
        </Button>

        {saveLabel && onSave ? (
          <Button
            type="button"
            onClick={onSave}
            disabled={busy}
            className="h-12 shrink-0 gap-2 rounded-xl border border-brand-secondary bg-white px-3 text-xs font-semibold text-brand hover:bg-brand-background-green sm:px-4 sm:text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CustomIcon
              src="/icons/file-write.svg"
              size={20}
              className="text-brand-secondary"
            />
            {saveLabel}
          </Button>
        ) : null}

        <Button
          type="button"
          onClick={onPay}
          disabled={busy}
          className="h-12 flex-1 rounded-xl bg-linear-to-br from-brand-secondary via-brand to-brand text-base font-extrabold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CustomIcon src="/icons/arrow-r.svg" size={24} />
          {isPaying ? (payingLabel ?? payLabel) : payLabel}
          <CustomIcon src="/icons/arrow-l.svg" size={24} />
        </Button>
      </div>
    </div>
  );
}
