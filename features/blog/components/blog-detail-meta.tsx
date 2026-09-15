import { Calendar, Clock, Eye } from "lucide-react";

import type { BlogDetailPost } from "@/features/blog/types/blog-detail";

type BlogDetailMetaProps = {
  post: Pick<
    BlogDetailPost,
    "category" | "title" | "date" | "readTime" | "views"
  >;
};

export default function BlogDetailMeta({ post }: BlogDetailMetaProps) {
  return (
    <header className="space-y-4 text-center">
      <p className="text-sm font-semibold text-muted-foreground">
        {post.category}
      </p>

      <h1 className="text-3xl font-extrabold leading-tight text-brand md:text-4xl">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-4" aria-hidden="true" />
          {post.date}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" aria-hidden="true" />
          {post.readTime}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye className="size-4" aria-hidden="true" />
          {post.views}
        </span>
      </div>
    </header>
  );
}
