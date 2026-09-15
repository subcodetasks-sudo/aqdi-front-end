export const BLOG_TAB_IDS = [
  "all",
  "property-management",
  "contracts",
  "real-estate-market",
] as const;

export type BlogTabId = (typeof BLOG_TAB_IDS)[number];

export type BlogCategoryId = Exclude<BlogTabId, "all">;

export const BLOG_CATEGORY_IDS = [
  "property-management",
  "contracts",
  "real-estate-market",
  "legal-tips",
  "rental-guide",
] as const;

export type BlogSidebarCategoryId = (typeof BLOG_CATEGORY_IDS)[number];
