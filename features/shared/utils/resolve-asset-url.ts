import { BASE_URL } from "@/lib/api/constants";

function getAssetOrigin() {
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return BASE_URL.replace(/\/$/, "");
  }
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
