"use client";

import { Switch } from "@/components/ui/switch";
import ManualDeedEntryForm from "@/features/shared/components/manual-deed-entry-form";
import type { ManualDeedEntryLabels } from "@/features/shared/types/manual-deed-entry-labels";
import type { ManualDeedEntryData } from "@/features/shared/types/manual-deed-entry";
import type { ComponentType, ReactNode } from "react";

type FormSelectProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hideLabel?: boolean;
  variant?: "default" | "compact";
  valid?: boolean;
};

type FieldLabelProps = {
  label: string;
};

type DeedInstrumentEntrySectionProps = {
  labels: ManualDeedEntryLabels;
  useManualDeedEntry: boolean;
  onUseManualDeedEntryChange: (value: boolean) => void;
  manualDeedEntry: ManualDeedEntryData;
  onManualDeedEntryChange: (value: ManualDeedEntryData) => void;
  upload: ReactNode;
  FormSelect: ComponentType<FormSelectProps>;
  FieldLabel: ComponentType<FieldLabelProps>;
};

export default function DeedInstrumentEntrySection({
  labels,
  useManualDeedEntry,
  onUseManualDeedEntryChange,
  manualDeedEntry,
  onManualDeedEntryChange,
  upload,
  FormSelect,
  FieldLabel,
}: DeedInstrumentEntrySectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-5 rounded-[24px] border border-[#ececec] bg-white p-4 md:p-5">
        {!useManualDeedEntry ? (
          <>
            {upload}

            <div className="relative flex items-center">
              <div className="h-px flex-1 border-t border-dashed border-[#d9d9d9]" />
              <span className="max-w-[75%] shrink-0 px-3 text-center text-xs leading-5 text-[#8a8a8a]">
                {labels.separator}
              </span>
              <div className="h-px flex-1 border-t border-dashed border-[#d9d9d9]" />
            </div>
          </>
        ) : null}

        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3.5">
          <span className="text-sm font-semibold text-[#333333]">
            {labels.toggleLabel}
          </span>
          <Switch
            dir="ltr"
            checked={useManualDeedEntry}
            onCheckedChange={onUseManualDeedEntryChange}
            className="shrink-0 border-0 data-checked:bg-brand data-unchecked:bg-[#d9d9d9] data-[size=default]:h-6 data-[size=default]:w-11 [&_[data-slot=switch-thumb]]:size-5"
          />
        </label>
      </div>

      {useManualDeedEntry ? (
        <ManualDeedEntryForm
          labels={labels}
          value={manualDeedEntry}
          onChange={onManualDeedEntryChange}
          FormSelect={FormSelect}
          FieldLabel={FieldLabel}
        />
      ) : null}
    </div>
  );
}
