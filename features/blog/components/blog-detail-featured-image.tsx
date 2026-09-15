import Image from "next/image";

import type { BlogDetailPost } from "@/features/blog/types/blog-detail";

type BlogDetailFeaturedImageProps = {
  imageSrc: BlogDetailPost["imageSrc"];
  imageAlt: BlogDetailPost["imageAlt"];
};

export default function BlogDetailFeaturedImage({
  imageSrc,
  imageAlt,
}: BlogDetailFeaturedImageProps) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
      />
    </div>
  );
}
