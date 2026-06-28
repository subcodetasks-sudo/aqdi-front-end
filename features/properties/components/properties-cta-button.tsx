"use client";

import { Button } from "@/components/ui/button";
import PropertiesTypeDialog from "@/features/properties/components/properties-type-dialog";
import type { PropertiesTypeDialogLabels } from "@/features/properties/types/properties-type-dialog-labels";
import CustomIcon from "@/features/shared/components/custom-icon";

type PropertiesCtaButtonProps = {
  label: string;
  typeDialogLabels: PropertiesTypeDialogLabels;
};

export default function PropertiesCtaButton({
  label,
  typeDialogLabels,
}: PropertiesCtaButtonProps) {
  return (
    <PropertiesTypeDialog labels={typeDialogLabels}>
      <Button
        type="button"
        className="h-12 w-full rounded-full bg-linear-to-l from-brand-secondary to-brand text-base font-semibold text-white hover:opacity-90"
      >
        <CustomIcon src="/icons/arrow-r.svg" size={30} />
        {label}
        <CustomIcon src="/icons/arrow-l.svg" size={30} />
      </Button>
    </PropertiesTypeDialog>
  );
}
