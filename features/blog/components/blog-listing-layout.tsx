import BlogCategoryTabs from "@/features/blog/components/blog-category-tabs";
import BlogListingSidebar from "@/features/blog/components/blog-listing-sidebar";
import type { BlogListingLabels } from "@/features/blog/types/blog-listing-labels";
import type { BlogGridPost } from "@/features/blog/types/blog-post";

type BlogListingLayoutProps = {
  labels: BlogListingLabels;
  posts: BlogGridPost[];
};

export default function BlogListingLayout({
  labels,
  posts,
}: BlogListingLayoutProps) {
  return (
    <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-10">
      <div className="min-w-0">
        <BlogCategoryTabs labels={labels} posts={posts} />
      </div>

      <BlogListingSidebar labels={labels.sidebar} />
    </div>
  );
}
