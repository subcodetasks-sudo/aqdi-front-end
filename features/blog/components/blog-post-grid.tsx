import BlogPostGridCard from "@/features/blog/components/blog-post-grid-card";
import type { BlogGridPost } from "@/features/blog/types/blog-post";

type BlogPostGridProps = {
  posts: BlogGridPost[];
  readMoreLabel: string;
};

export default function BlogPostGrid({ posts, readMoreLabel }: BlogPostGridProps) {
  return (
    <div className="grid min-w-0 items-stretch gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((post, index) => (
        <BlogPostGridCard
          key={`${post.slug}-${index}`}
          post={post}
          readMoreLabel={readMoreLabel}
        />
      ))}
    </div>
  );
}
