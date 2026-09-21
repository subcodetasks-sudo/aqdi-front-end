import { getToken } from "@/actions/auth";
import { BASE_URL } from "@/lib/api/constants";

export const runtime = "nodejs";

function getAllowedAssetOrigin() {
  return new URL(BASE_URL).origin;
}

function isAllowedAssetUrl(url: URL) {
  if (url.origin !== getAllowedAssetOrigin()) {
    return false;
  }

  // Block API endpoints — this proxy must only stream file assets, never JSON
  // routes (would otherwise become an authenticated open proxy into /api/v2).
  return !url.pathname.startsWith("/api/");
}

export async function GET(request: Request) {
  const token = await getToken();

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const target = new URL(request.url).searchParams.get("url");

  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  let assetUrl: URL;

  try {
    assetUrl = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (!isAllowedAssetUrl(assetUrl)) {
    return new Response("Forbidden", { status: 403 });
  }

  let upstream: Response;

  try {
    upstream = await fetch(assetUrl.toString(), {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  if (!upstream.ok) {
    return new Response("Upstream error", { status: upstream.status });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  const body = await upstream.arrayBuffer();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=300",
    },
  });
}
