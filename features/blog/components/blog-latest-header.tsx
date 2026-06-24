import BlogShareButton from "@/features/blog/components/blog-share-button";

type BlogLatestHeaderProps = {
  badge: string;
  title: string;
  description: string;
  shareLabel: string;
};

export default function BlogLatestHeader({
  badge,
  title,
  description,
  shareLabel,
}: BlogLatestHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 text-start">
        <p className="text-sm font-semibold text-muted-foreground">{badge}</p>
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-brand ">
          {title}
        </h1>
        <p className="max-w-xl text-sm leading-8 text-muted-foreground">
          {description}
        </p>
      </div>

      <BlogShareButton label={shareLabel} />
    </div>
  );
}
