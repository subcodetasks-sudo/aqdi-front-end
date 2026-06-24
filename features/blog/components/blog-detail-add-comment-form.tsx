"use client";

import { ArrowUpLeft } from "lucide-react";
import { useState } from "react";

import type { BlogDetailCommentsLabels } from "@/features/blog/types/blog-detail-comments";

type BlogDetailAddCommentFormProps = Pick<
  BlogDetailCommentsLabels,
  "formTitle" | "formPlaceholder" | "submitLabel" | "submitAriaLabel"
>;

export default function BlogDetailAddCommentForm({
  formTitle,
  formPlaceholder,
  submitLabel,
  submitAriaLabel,
}: BlogDetailAddCommentFormProps) {
  const [comment, setComment] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComment("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-start text-lg font-extrabold text-brand md:text-xl">
        {formTitle}
      </h3>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={formPlaceholder}
        rows={5}
        className="w-full resize-none rounded-[28px] bg-brand-background px-5 py-4 text-start text-sm leading-7 text-foreground outline-none placeholder:text-[#bdbdbd] md:text-base"
      />

      <button
        type="submit"
        aria-label={submitAriaLabel}
        className="flex h-14 w-full items-center justify-between rounded-full bg-brand-secondary px-2 ps-5 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:min-w-[220px]"
      >
        <span>{submitLabel}</span>
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand">
          <ArrowUpLeft className="size-4" aria-hidden="true" />
        </span>
      </button>
    </form>
  );
}
