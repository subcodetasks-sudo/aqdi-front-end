import type { BlogCategoryId } from "@/features/blog/types/blog-category";

export type BlogPost = {
  slug: string;
  imageSrc: string;
  featuredCategory: string;
  featuredTitle: string;
  listCategory: string;
  listTitle: string;
  description: string;
  date: string;
  readTime: string;
  views: string;
};

export type BlogGridPost = BlogPost & {
  categoryId: BlogCategoryId;
};
