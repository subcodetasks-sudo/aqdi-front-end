import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import BlogDetailPageContent from "@/features/blog/components/blog-detail-page-content";
import { BLOG_POST_IMAGE, BLOG_POST_SLUG } from "@/features/blog/data/blog-post-config";
import type { BlogDetailComment } from "@/features/blog/types/blog-detail-comments";
import type { BlogDetailLabels, BlogDetailSection } from "@/features/blog/types/blog-detail";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const t = await getTranslations("blog.detail");

  if (slug !== BLOG_POST_SLUG) {
    notFound();
  }

  const labels: BlogDetailLabels = {
    shareArticle: t("shareArticle"),
    shareOnX: t("shareOnX"),
    shareOnLinkedin: t("shareOnLinkedin"),
    shareGeneric: t("shareGeneric"),
  };

  const post = {
    slug,
    category: t("post.category"),
    title: t("post.title"),
    date: t("post.date"),
    readTime: t("post.readTime"),
    views: t("post.views"),
    imageSrc: BLOG_POST_IMAGE,
    imageAlt: t("post.imageAlt"),
    sections: t.raw("post.sections") as BlogDetailSection[],
  };

  const commentsLabels = {
    tags: t.raw("comments.tags") as string[],
    title: t("comments.title"),
    comments: t.raw("comments.items") as BlogDetailComment[],
    authorImageAlt: t("comments.authorImageAlt"),
    formTitle: t("comments.form.title"),
    formPlaceholder: t("comments.form.placeholder"),
    submitLabel: t("comments.form.submit"),
    submitAriaLabel: t("comments.form.submitAriaLabel"),
    likeAriaLabel: t("comments.likeAriaLabel"),
    shareAriaLabel: t("comments.shareAriaLabel"),
  };

  return (
    <BlogDetailPageContent
      post={post}
      labels={labels}
      commentsLabels={commentsLabels}
    />
  );
}
