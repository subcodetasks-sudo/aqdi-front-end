"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import CreateContractFinanceAccordion from "@/features/create-contract/components/create-contract-finance-accordion";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractFinanceConditionsSectionProps = {
  labels: CreateContractLabels["finance"]["otherConditions"];
  value: string;
  onChange: (value: string) => void;
};

function parseConditions(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function CreateContractFinanceConditionsSection({
  labels,
  value,
  onChange,
}: CreateContractFinanceConditionsSectionProps) {
  const [draft, setDraft] = useState("");
  const conditions = parseConditions(value);

  function addCondition() {
    const next = draft.trim();
    if (!next) {
      return;
    }

    onChange([...conditions, next].join("\n"));
    setDraft("");
  }

  function removeCondition(index: number) {
    onChange(conditions.filter((_, i) => i !== index).join("\n"));
  }

  return (
    <CreateContractFinanceAccordion
      title={labels.title}
      subtitle={labels.subtitle}
      defaultOpen={conditions.length > 0}
    >
      <p className="text-xs leading-5 text-[#9a9a9a]">{labels.instruction}</p>

      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCondition();
            }
          }}
          placeholder={labels.placeholder}
          className="h-12 flex-1 rounded-xl border-[#1a1a1a] bg-white px-4 text-sm shadow-none focus-visible:border-brand focus-visible:ring-brand/20"
        />
        <button
          type="button"
          onClick={addCondition}
          disabled={!draft.trim()}
          aria-label={labels.add}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-background-green text-brand disabled:opacity-40"
        >
          <Plus className="size-6" aria-hidden />
        </button>
      </div>

      {conditions.length > 0 ? (
        <ul className="space-y-2">
          {conditions.map((condition, index) => (
            <li
              key={`${condition}-${index}`}
              className="flex items-center gap-3 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3"
            >
              <span className="flex-1 text-sm font-semibold text-brand">
                {condition}
              </span>
              <button
                type="button"
                onClick={() => removeCondition(index)}
                aria-label={labels.remove}
                className="inline-flex size-8 items-center justify-center rounded-full text-[#c62828] hover:bg-[#fff0f0]"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </CreateContractFinanceAccordion>
  );
}
