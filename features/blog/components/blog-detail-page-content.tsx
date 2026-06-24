import BlogDetailArticleBody from "@/features/blog/components/blog-detail-article-body";
import BlogDetailCommentsSection from "@/features/blog/components/blog-detail-comments-section";
import BlogDetailFeaturedImage from "@/features/blog/components/blog-detail-featured-image";
import BlogDetailMeta from "@/features/blog/components/blog-detail-meta";
import BlogDetailShareBar from "@/features/blog/components/blog-detail-share-bar";
import type { BlogDetailCommentsLabels } from "@/features/blog/types/blog-detail-comments";
import type { BlogDetailLabels, BlogDetailPost } from "@/features/blog/types/blog-detail";

type BlogDetailPageContentProps = {
  post: BlogDetailPost;
  labels: BlogDetailLabels;
  commentsLabels: BlogDetailCommentsLabels;
};

export default function BlogDetailPageContent({
  post,
  labels,
  commentsLabels,
}: BlogDetailPageContentProps) {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <BlogDetailMeta post={post} />

          <BlogDetailShareBar labels={labels} title={post.title} />

          <BlogDetailFeaturedImage
            imageSrc={post.imageSrc}
            imageAlt={post.imageAlt}
          />

          <BlogDetailArticleBody sections={post.sections} />

          <BlogDetailCommentsSection labels={commentsLabels} />
        </div>
      </div>
    </section>
  );
}
