/**
 * Detects the "website closed" signal on any backend response.
 *
 * The backend answers every website request (those carrying the
 * `X-Client: website` header) with an HTTP 503 and `data.is_open === false`
 * while the site is closed for maintenance. This is deliberately narrow: a
 * bare 503 from infrastructure (no maintenance body) is not treated as a
 * closure, and it is never a 401 / network failure.
 */
export function isWebsiteClosedResponse(status: number, body: unknown): boolean {
  if (status !== 503) {
    return false;
  }

  if (!body || typeof body !== "object") {
    return false;
  }

  const data = (body as { data?: { is_open?: unknown } }).data;

  return data?.is_open === false;
}
