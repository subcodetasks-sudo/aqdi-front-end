import { toProxiedAssetUrl } from "@/features/shared/utils/resolve-asset-url";

/**
 * Prefer a newly selected File; otherwise download an existing remote asset
 * (via the auth proxy) so update requests still include the document.
 */
export async function resolveUploadFile(options: {
  localFile?: File;
  existingUrl?: string | null;
  fallbackFileName: string;
}): Promise<File | undefined> {
  if (options.localFile) {
    return options.localFile;
  }

  const existingUrl = options.existingUrl?.trim();
  if (!existingUrl) {
    return undefined;
  }

  const proxyUrl = toProxiedAssetUrl(existingUrl);
  if (!proxyUrl) {
    return undefined;
  }

  try {
    const response = await fetch(proxyUrl, { cache: "no-store" });
    if (!response.ok) {
      return undefined;
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      return undefined;
    }

    const rawName =
      existingUrl.split("/").pop()?.split("?")[0]?.trim() ||
      options.fallbackFileName;
    const fileName = rawName.length > 0 ? rawName : options.fallbackFileName;
    const type =
      blob.type && blob.type !== "application/octet-stream"
        ? blob.type
        : guessMimeType(fileName);

    return new File([blob], fileName, { type });
  } catch {
    return undefined;
  }
}

function guessMimeType(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}
