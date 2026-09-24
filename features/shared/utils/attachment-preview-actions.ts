import { toProxiedAssetUrl } from "@/features/shared/utils/resolve-asset-url";

export function downloadAttachment(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "attachment";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function downloadFromHref(href: string, fileName: string) {
  const sameOrigin =
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !href.startsWith("blob:") &&
    !href.startsWith("data:");
  const response = await fetch(href, {
    credentials: sameOrigin ? "same-origin" : "omit",
  });
  if (!response.ok) {
    throw new Error("download failed");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  downloadAttachment(objectUrl, fileName);
  URL.revokeObjectURL(objectUrl);
}

export async function downloadAttachmentRobust(url: string, fileName: string) {
  if (!url) {
    return;
  }

  if (url.startsWith("blob:") || url.startsWith("data:")) {
    downloadAttachment(url, fileName);
    return;
  }

  const proxied = toProxiedAssetUrl(url);
  const candidates = proxied && proxied !== url ? [proxied, url] : [url];

  for (const href of candidates) {
    try {
      await downloadFromHref(href, fileName);
      return;
    } catch {
      /* try the next candidate instead of opening a new tab */
    }
  }
}

function isPdfUrl(url: string) {
  return /\.pdf(\?|#|$)/i.test(url);
}

function printViaPopup(url: string) {
  // Without a features string window.open returns a usable handle; "noopener"
  // would null it and we could never call print().
  const printWindow = window.open(url, "_blank");
  if (!printWindow) {
    return;
  }

  const triggerPrint = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      // Cross-origin document — the user can still print from the new tab.
    }
  };

  printWindow.addEventListener("load", triggerPrint);
  window.setTimeout(triggerPrint, 600);
}

export function printAttachment(url: string) {
  // PDFs: let the browser's PDF viewer handle it in a new tab.
  if (isPdfUrl(url)) {
    printViaPopup(url);
    return;
  }

  // Images: render into a same-origin hidden iframe we control so print() is
  // not blocked by the cross-origin policy that applies to window.open(imageUrl).
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  const cleanup = () => {
    window.setTimeout(() => {
      iframe.remove();
    }, 1000);
  };

  iframe.onload = () => {
    const frameWindow = iframe.contentWindow;
    if (!frameWindow) {
      cleanup();
      return;
    }

    const image = iframe.contentDocument?.querySelector("img");

    const runPrint = () => {
      try {
        frameWindow.focus();
        frameWindow.print();
      } catch {
        printViaPopup(url);
      } finally {
        cleanup();
      }
    };

    if (image && !image.complete) {
      image.addEventListener("load", runPrint, { once: true });
      image.addEventListener("error", () => {
        printViaPopup(url);
        cleanup();
      }, { once: true });
      return;
    }

    runPrint();
  };

  iframe.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { margin: 12mm; }
    html, body { margin: 0; padding: 0; }
    img { display: block; width: 100%; height: auto; }
  </style></head><body><img src="${url.replace(/"/g, "&quot;")}" alt=""></body></html>`;

  document.body.appendChild(iframe);
}

export function fileNameFromUrl(url: string) {
  try {
    const path = new URL(url, "https://local.invalid").pathname;
    const name = path.split("/").filter(Boolean).pop();
    return name ? decodeURIComponent(name) : "";
  } catch {
    return "";
  }
}

export function resolveAttachmentKind(
  mimeType: string | undefined,
  nameOrUrl: string,
): "image" | "pdf" | "other" {
  if (
    mimeType?.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(nameOrUrl)
  ) {
    return "image";
  }

  if (mimeType === "application/pdf" || /\.pdf(\?|$)/i.test(nameOrUrl)) {
    return "pdf";
  }

  return "other";
}
