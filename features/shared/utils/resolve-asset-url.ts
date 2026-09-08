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
 * Assets are served from the host root (e.g. /storage, /uploads), not from the
 * API path in BASE_URL (which may be suffixed with /api/v2).
 */
export function resolveAssetUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      url.pathname = `/${normalizeAssetPath(url.pathname)}`;
      return url.toString();
    } catch {
      return path;
    }
  }

  return `${getAssetOrigin()}/${normalizeAssetPath(path)}`;
}
