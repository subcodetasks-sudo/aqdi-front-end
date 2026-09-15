"use client";

import { Share2 } from "lucide-react";

import type { BlogDetailLabels } from "@/features/blog/types/blog-detail";

type BlogDetailShareBarProps = {
  labels: Pick<
    BlogDetailLabels,
    "shareArticle" | "shareOnX" | "shareOnLinkedin" | "shareGeneric"
  >;
  title: string;
};

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-current"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-current"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function BlogDetailShareBar({
  labels,
  title,
}: BlogDetailShareBarProps) {
  async function handleShare() {
    const shareData = {
      title,
      url: window.location.href,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
      } catch {
        return;
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      return;
    }
  }

  function openShareWindow(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareOnX() {
    const encodedUrl = encodeURIComponent(window.location.href);
    const encodedTitle = encodeURIComponent(title);
    openShareWindow(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    );
  }

  function shareOnLinkedin() {
    const encodedUrl = encodeURIComponent(window.location.href);
    openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    );
  }

  return (
    <div className="flex items-center justify-center  gap-4 rounded-2xl   px-4 py-3">
      <span className="text-sm font-semibold text-muted-foreground">
        {labels.shareArticle}
      </span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={labels.shareOnX}
          onClick={shareOnX}
          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground  "
        >
          <XIcon />
        </button>

        <button
          type="button"
          aria-label={labels.shareOnLinkedin}
          onClick={shareOnLinkedin}
          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LinkedinIcon />
        </button>

        <button
          type="button"
          aria-label={labels.shareGeneric}
          onClick={handleShare}
          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Share2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
