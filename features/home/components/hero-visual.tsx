import { preload } from "react-dom";
import { getImageProps } from "next/image";

type HeroVisualProps = {
  alt: string;
  imageUrl: string;
};

/**
 * Desktop-only hero art. Art-directed <picture> + media-scoped preload so mobile
 * never downloads this LCP candidate (CSS hide alone still downloads priority images).
 */
export default function HeroVisual({ alt, imageUrl }: HeroVisualProps) {
  const { props } = getImageProps({
    src: imageUrl,
    alt,
    width: 720,
    height: 640,
    sizes: "50vw",
    quality: 75,
  });

  const { srcSet, sizes, src, ...imgProps } = props;

  if (srcSet) {
    preload(src, {
      as: "image",
      imageSrcSet: srcSet,
      imageSizes: sizes,
      media: "(min-width: 1024px)",
      fetchPriority: "high",
    });
  } else {
    preload(src, {
      as: "image",
      media: "(min-width: 1024px)",
      fetchPriority: "high",
    });
  }

  return (
    <div className="hidden w-full lg:block">
      <div className="overflow-hidden rounded-3xl lg:rounded-[32px]">
        <picture>
          <source media="(min-width: 1024px)" srcSet={srcSet ?? src} sizes={sizes} />
          {/* eslint-disable-next-line @next/next/no-img-element -- art-directed; next/image cannot media-gate preload */}
          <img
            {...imgProps}
            src={
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
            }
            alt={alt}
            className="h-auto w-full object-contain"
            decoding="async"
          />
        </picture>
      </div>
    </div>
  );
}
