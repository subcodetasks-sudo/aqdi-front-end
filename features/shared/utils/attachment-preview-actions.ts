export function downloadAttachment(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "attachment";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function downloadAttachmentRobust(url: string, fileName: string) {
  try {
    if (url.startsWith("blob:") || url.startsWith("data:")) {
      downloadAttachment(url, fileName);
      return;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("download failed");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    downloadAttachment(objectUrl, fileName);
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function printAttachment(url: string) {
  const printWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (!printWindow) {
    return;
  }

  const triggerPrint = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      // Browser may block print until the document finishes loading.
    }
  };

  printWindow.addEventListener("load", triggerPrint);
  window.setTimeout(triggerPrint, 600);
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
