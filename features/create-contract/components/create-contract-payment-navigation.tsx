import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";

type CreateContractPaymentNavigationProps = {
  previousLabel: string;
  payLabel: string;
  onPrevious: () => void;
  onPay: () => void;
};

export default function CreateContractPaymentNavigation({
  previousLabel,
  payLabel,
  onPrevious,
  onPay,
}: CreateContractPaymentNavigationProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        onClick={onPrevious}
        className="h-12 shrink-0 rounded-xl bg-[#666666] px-5 text-sm font-semibold text-white hover:bg-[#555555]"
      >
        <ChevronLeft className="size-4 -rotate-180" aria-hidden="true" />
        {previousLabel}
      </Button>

      <Button
        type="button"
        onClick={onPay}
        className="h-12 flex-1 rounded-xl bg-linear-to-br from-brand-secondary via-brand to-brand text-base font-extrabold text-white hover:opacity-90"
      >
        <CustomIcon src="/icons/arrow-r.svg" size={24} />
        {payLabel}
        <CustomIcon src="/icons/arrow-l.svg" size={24} />
      </Button>
    </div>
  );
}
