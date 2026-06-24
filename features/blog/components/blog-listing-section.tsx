import { getTranslations } from "next-intl/server";

import BlogListingLayout from "@/features/blog/components/blog-listing-layout";
import {
  BLOG_GRID_TOTAL_POSTS,
  BLOG_POST_CATEGORY_ROTATION,
  BLOG_POST_IMAGE,
  BLOG_POST_SLUG,
} from "@/features/blog/data/blog-post-config";
import type { BlogListingLabels } from "@/features/blog/types/blog-listing-labels";
import type { BlogCategoryId } from "@/features/blog/types/blog-category";
import type { BlogGridPost } from "@/features/blog/types/blog-post";

function buildGridPosts(
  postLabels: BlogListingLabels["post"],
): BlogGridPost[] {
  return Array.from({ length: BLOG_GRID_TOTAL_POSTS }, (_, index) => ({
    slug: BLOG_POST_SLUG,
    imageSrc: BLOG_POST_IMAGE,
    featuredCategory: "",
    featuredTitle: "",
    listCategory: postLabels.listCategory,
    listTitle: postLabels.listTitle,
    description: "",
    date: postLabels.date,
    readTime: postLabels.readTime,
    views: postLabels.views,
    categoryId: BLOG_POST_CATEGORY_ROTATION[
      index % BLOG_POST_CATEGORY_ROTATION.length
    ] as BlogCategoryId,
  }));
}

export default async function BlogListingSection() {
  const t = await getTranslations("blog.listing");

  const labels: BlogListingLabels = {
    tabs: {
      all: t("tabs.all"),
      propertyManagement: t("tabs.propertyManagement"),
      contracts: t("tabs.contracts"),
      realEstateMarket: t("tabs.realEstateMarket"),
    },
    sidebar: {
      stats: {
        title: t("sidebar.stats.title"),
        subtitle: t("sidebar.stats.subtitle"),
        description: t("sidebar.stats.description"),
        statsHeading: t("sidebar.stats.statsHeading"),
        logoAlt: t("sidebar.stats.logoAlt"),
        activeUsers: t("sidebar.stats.activeUsers"),
        activeUsersLabel: t("sidebar.stats.activeUsersLabel"),
        annualContracts: t("sidebar.stats.annualContracts"),
        annualContractsLabel: t("sidebar.stats.annualContractsLabel"),
        leasedUnits: t("sidebar.stats.leasedUnits"),
        leasedUnitsLabel: t("sidebar.stats.leasedUnitsLabel"),
      },
      categories: {
        title: t("sidebar.categories.title"),
        items: t.raw("sidebar.categories.items") as BlogListingLabels["sidebar"]["categories"]["items"],
      },
      tags: {
        title: t("sidebar.tags.title"),
        items: t.raw("sidebar.tags.items") as string[],
      },
      newsletter: {
        badge: t("sidebar.newsletter.badge"),
        title: t("sidebar.newsletter.title"),
        description: t("sidebar.newsletter.description"),
        placeholder: t("sidebar.newsletter.placeholder"),
        subscribe: t("sidebar.newsletter.subscribe"),
        submitEmailLabel: t("sidebar.newsletter.submitEmailLabel"),
      },
    },
    post: {
      listCategory: t("post.listCategory"),
      listTitle: t("post.listTitle"),
      date: t("post.date"),
      readTime: t("post.readTime"),
      views: t("post.views"),
      readMore: t("post.readMore"),
    },
    pagination: {
      previous: t("pagination.previous"),
      next: t("pagination.next"),
    },
  };

  const posts = buildGridPosts(labels.post);

  return (
    <section className=" py-12 md:py-16">
      <div className="container">
        <BlogListingLayout labels={labels} posts={posts} />
      </div>
    </section>
  );
}
