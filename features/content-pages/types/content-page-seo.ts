import type { ContentPageKey } from "@/features/content-pages/constants";

export type ContentPageSeo = {
  page: ContentPageKey | string;
  meta_title?: string | null;
  meta_description?: string | null;
};

export type ContentPagesSeoMap = Partial<
  Record<ContentPageKey, ContentPageSeo | null>
>;

export type ContentPagesSeoApiResponse = {
  message?: string;
  code?: number;
  success?: boolean;
  data?: ContentPagesSeoMap | null;
};
