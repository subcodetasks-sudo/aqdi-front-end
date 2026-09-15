import { cn } from "@/lib/utils";

type BlogDetailCommentStarRatingProps = {
  rating: number;
  className?: string;
};

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-3.5 fill-[#fbbf24]">
      <path d="M10 1.5 12.472 7.008 18.5 7.864 14.25 12.042 15.236 18.05 10 15.258 4.764 18.05 5.75 12.042 1.5 7.864 7.528 7.008 10 1.5Z" />
    </svg>
  );
}

export default function BlogDetailCommentStarRating({
  rating,
  className,
}: BlogDetailCommentStarRatingProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-3 py-1.5",
        className,
      )}
    >
      <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon key={index} />
        ))}
      </div>
    </div>
  );
}
