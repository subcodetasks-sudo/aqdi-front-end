import type { BlogDetailSection } from "@/features/blog/types/blog-detail";
import { cn } from "@/lib/utils";

type BlogDetailArticleBodyProps = {
  sections: BlogDetailSection[];
};

export default function BlogDetailArticleBody({
  sections,
}: BlogDetailArticleBodyProps) {
  return (
    <article className="space-y-6 text-start">
      {sections.map((section, index) => {
        if (section.type === "heading") {
          return (
            <h2
              key={`${section.type}-${index}`}
              className="text-2xl font-extrabold leading-snug text-brand md:text-3xl"
            >
              {section.content}
            </h2>
          );
        }

        if (section.type === "quote") {
          return (
            <blockquote
              key={`${section.type}-${index}`}
              className={cn(
                "border-s-4 border-brand-secondary ps-4 text-base leading-8 text-foreground/90 md:text-lg",
              )}
            >
              {section.content}
            </blockquote>
          );
        }

        return (
          <p
            key={`${section.type}-${index}`}
            className="text-base leading-8 text-foreground/80 md:text-lg"
          >
            {section.content}
          </p>
        );
      })}
    </article>
  );
}
