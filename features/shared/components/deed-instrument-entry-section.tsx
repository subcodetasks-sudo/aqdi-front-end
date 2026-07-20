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
      {!useManualDeedEntry ? upload : null}

      <div className="relative flex items-center py-1">
        <div className="h-px flex-1 bg-[#ececec]" />
        <span className="px-4 text-xs text-[#7f7f7f]">{labels.separator}</span>
        <div className="h-px flex-1 bg-[#ececec]" />
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3">
        <span className="text-sm font-semibold text-brand">{labels.toggleLabel}</span>
        <Switch
          dir="ltr"
          checked={useManualDeedEntry}
          onCheckedChange={onUseManualDeedEntryChange}
          className="h-6 w-11 shrink-0 data-checked:bg-brand-secondary data-unchecked:bg-[#d9d9d9]"
        />
      </label>

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
