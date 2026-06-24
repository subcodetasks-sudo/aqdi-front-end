import { getTranslations } from "next-intl/server";

import BlogFeaturedCard from "@/features/blog/components/blog-featured-card";
import BlogLatestHeader from "@/features/blog/components/blog-latest-header";
import BlogListCard from "@/features/blog/components/blog-list-card";
import {
  BLOG_LIST_ITEMS_COUNT,
  BLOG_POST_IMAGE,
  BLOG_POST_SLUG,
} from "@/features/blog/data/blog-post-config";
import type { BlogLatestLabels } from "@/features/blog/types/blog-labels";
import type { BlogPost } from "@/features/blog/types/blog-post";

export default async function BlogLatestSection() {
  const t = await getTranslations("blog.latest");

  const labels: BlogLatestLabels = {
    badge: t("badge"),
    title: t("title"),
    description: t("description"),
    share: t("share"),
    post: {
      featuredCategory: t("post.featuredCategory"),
      featuredTitle: t("post.featuredTitle"),
      listCategory: t("post.listCategory"),
      listTitle: t("post.listTitle"),
      description: t("post.description"),
      date: t("post.date"),
      readTime: t("post.readTime"),
      views: t("post.views"),
    },
  };

  const post: BlogPost = {
    slug: BLOG_POST_SLUG,
    imageSrc: BLOG_POST_IMAGE,
    featuredCategory: labels.post.featuredCategory,
    featuredTitle: labels.post.featuredTitle,
    listCategory: labels.post.listCategory,
    listTitle: labels.post.listTitle,
    description: labels.post.description,
    date: labels.post.date,
    readTime: labels.post.readTime,
    views: labels.post.views,
  };

  const listItems = Array.from({ length: BLOG_LIST_ITEMS_COUNT }, () => post);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container min-w-0 space-y-10 md:space-y-12">
        <BlogLatestHeader
          badge={labels.badge}
          title={labels.title}
          description={labels.description}
          shareLabel={labels.share}
        />

        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
          <BlogFeaturedCard post={post} />

          <div className="flex h-full flex-col gap-4">
            {listItems.map((item, index) => (
              <BlogListCard key={`${item.slug}-${index}`} post={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
