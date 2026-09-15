"use client";

import { Copy } from "lucide-react";

type RequestCopyIdButtonProps = {
  requestNumber: string;
  copyLabel: string;
};

export default function RequestCopyIdButton({
  requestNumber,
  copyLabel,
}: RequestCopyIdButtonProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(requestNumber);
    } catch {
      return;
    }
  }

  return (
    <button
      type="button"
      aria-label={copyLabel}
      onClick={handleCopy}
      className="inline-flex size-8 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand-background-green hover:text-brand dark:text-[#00a67e] dark:hover:bg-[#0e312a]"
    >
      <Copy className="size-3.5" aria-hidden="true" />
    </button>
  );
}
