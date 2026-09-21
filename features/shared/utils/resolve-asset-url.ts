import { BASE_URL } from "@/lib/api/constants";

function getAssetOrigin() {
  return new URL(BASE_URL).origin;
}

/**
 * Normalize a relative asset path for Laravel public storage.
 * API fields return disk-relative paths (e.g. `images/...`, `authorizations/...`);
 * those files are served at `/storage/...`.
 */
function normalizeAssetPath(pathname: string) {
  let path = pathname.replace(/^\/+/, "");

  // Strip API prefix if it leaked into a relative path.
  path = path.replace(/^api(?:\/v\d+)?\//i, "");

  if (path.startsWith("storage/") || path.startsWith("uploads/")) {
    return path;
  }

  // Public disk files are exposed under /storage/...
  return `storage/${path}`;
}

/**
 * Resolve API-relative asset paths to absolute URLs.
 * Absolute http(s) URLs are returned unchanged — rewriting their pathname
 * (e.g. forcing /storage/) breaks already-correct CDN/API image links.
 * Relative paths are resolved against the API host root (/storage, /uploads).
 */
export function resolveAssetUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${getAssetOrigin()}/${normalizeAssetPath(path)}`;
}

/**
 * Browser `<img>` / Next Image cannot send the httpOnly bearer cookie to the
 * API host, and Laravel storage assets are auth-gated. Route same-origin
 * previews through `/api/assets/proxy` so the server attaches the token.
 */
export function toProxiedAssetUrl(path: string | null | undefined) {
  const resolved = resolveAssetUrl(path);

  if (!resolved) {
    return null;
  }

  if (
    resolved.startsWith("blob:") ||
    resolved.startsWith("data:") ||
    resolved.startsWith("/api/assets/proxy")
  ) {
    return resolved;
  }

  try {
    const url = new URL(resolved);

    if (url.origin !== getAssetOrigin()) {
      return resolved;
    }
  } catch {
    return resolved;
  }

  return `/api/assets/proxy?url=${encodeURIComponent(resolved)}`;
}
