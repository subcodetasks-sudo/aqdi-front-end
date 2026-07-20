"use client";

import { Tag, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractDiscountCodeFieldProps = {
  labels: CreateContractLabels["payment"]["discountCode"];
  value: string;
  onChange: (value: string) => void;
};

export default function CreateContractDiscountCodeField({
  labels,
  value,
  onChange,
}: CreateContractDiscountCodeFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(Boolean(value.trim()));
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
    if (value.trim()) {
      setIsExpanded(true);
    }
  }, [value]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    inputRef.current?.focus();
  }, [isExpanded]);

  function handleExpand() {
    setIsExpanded(true);
  }

  function handleApply() {
    onChange(draft.trim());
  }

  function handleClear() {
    setDraft("");
    onChange("");
    setIsExpanded(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleApply();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      if (!value.trim()) {
        setDraft("");
        setIsExpanded(false);
      }
    }
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={handleExpand}
        className="flex w-full items-center gap-2 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-4 text-start transition-colors hover:border-brand/20 hover:bg-brand-background/40"
      >
        <Tag className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <span className="text-sm font-bold text-brand">{labels.question}</span>
        <span className="text-sm text-[#9a9a9a]">{labels.add}</span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <Tag className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <label htmlFor={inputId} className="text-sm font-bold text-brand">
          {labels.question}
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          id={inputId}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={labels.placeholder}
          autoComplete="off"
          className="h-11 flex-1 rounded-xl border-[#e8e8e8] bg-brand-background px-3 text-sm focus-visible:border-brand-secondary focus-visible:ring-brand-secondary/20"
        />

        <Button
          type="button"
          onClick={handleApply}
          disabled={!draft.trim()}
          className="h-11 shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-secondary disabled:opacity-50"
        >
          {labels.apply}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          aria-label={labels.clear}
          className="size-11 shrink-0 rounded-xl text-[#9a9a9a] hover:bg-brand-background hover:text-brand"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
