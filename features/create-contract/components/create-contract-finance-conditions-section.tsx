"use client";

import { Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import CreateContractFinanceAccordion from "@/features/create-contract/components/create-contract-finance-accordion";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import {
  getFilledOtherConditions,
  MAX_OTHER_CONDITIONS,
} from "@/features/create-contract/types/finance-step";

type CreateContractFinanceConditionsSectionProps = {
  labels: CreateContractLabels["finance"]["otherConditions"];
  enabled: boolean;
  value: string[];
  onEnabledChange: (enabled: boolean) => void;
  onChange: (value: string[]) => void;
};

export default function CreateContractFinanceConditionsSection({
  labels,
  enabled,
  value,
  onEnabledChange,
  onChange,
}: CreateContractFinanceConditionsSectionProps) {
  const conditions = value.length > 0 ? value : [""];
  const canAdd = conditions.length < MAX_OTHER_CONDITIONS;

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      onEnabledChange(true);
      if (value.length === 0) {
        onChange([""]);
      }
      return;
    }

    // Collapse only — keep drafted conditions. Disable flag only if nothing filled.
    if (getFilledOtherConditions(value).length === 0) {
      onEnabledChange(false);
    }
  }

  function updateCondition(index: number, nextValue: string) {
    const next = [...conditions];
    next[index] = nextValue;
    onChange(next);
  }

  function addCondition() {
    if (!canAdd) {
      return;
    }

    onChange([...conditions, ""]);
  }

  function removeCondition(index: number) {
    if (conditions.length <= 1) {
      onChange([""]);
      return;
    }

    onChange(conditions.filter((_, i) => i !== index));
  }

  return (
    <CreateContractFinanceAccordion
      title={labels.title}
      subtitle={labels.subtitle}
      defaultOpen={enabled || getFilledOtherConditions(value).length > 0}
      onOpenChange={handleOpenChange}
    >
      <p className="text-xs leading-5 text-[#9a9a9a]">{labels.instruction}</p>

      <ul className="space-y-2">
        {conditions.map((condition, index) => (
          <li key={index} className="flex items-center gap-2">
            <Input
              value={condition}
              onChange={(event) => updateCondition(index, event.target.value)}
              placeholder={labels.placeholder}
              className="h-12 flex-1 rounded-xl border-[#1a1a1a] bg-white px-4 text-sm shadow-none focus-visible:border-brand focus-visible:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => removeCondition(index)}
              aria-label={labels.remove}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-[#c62828] hover:bg-[#fff0f0]"
            >
              <Trash2 className="size-5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={addCondition}
        disabled={!canAdd}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-secondary bg-brand-background-green/40 text-sm font-semibold text-brand disabled:opacity-40"
      >
        <Plus className="size-4" aria-hidden />
        {labels.add}
      </button>
    </CreateContractFinanceAccordion>
  );
}
