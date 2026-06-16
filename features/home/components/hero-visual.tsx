import Image from "next/image";

type HeroVisualProps = {
  alt: string;
};

export default function HeroVisual({ alt }: HeroVisualProps) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-3xl lg:rounded-[32px]">
        <Image
          src="/images/hero.png"
          alt={alt}
          width={720}
          height={640}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
