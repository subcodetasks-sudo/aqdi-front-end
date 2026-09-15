/** Public + admin content-page keys. Canonical FAQ key is `faq` (not `faqs`). */
export const CONTENT_PAGE_KEYS = [
  "home",
  "about",
  "faq",
  "blogs",
  "services",
] as const;

export type ContentPageKey = (typeof CONTENT_PAGE_KEYS)[number];

/**
 * Relative to `NEXT_PUBLIC_BASE_URL` (`…/api/v2`).
 * Admin dashboard uses the same keys against `/api/admin/content-pages/{page}`.
 */
export const CONTENT_PAGE_ENDPOINTS = {
  list: "/content-pages",
  home: "/content-pages/home",
  about: "/content-pages/about",
  faq: "/content-pages/faq",
  blogs: "/content-pages/blogs",
  services: "/content-pages/services",
} as const;
