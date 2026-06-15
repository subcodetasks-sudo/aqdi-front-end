import Image from "next/image";

type HeroVisualProps = {
  alt: string;
};

export default function HeroVisual({ alt }: HeroVisualProps) {
  return (
    <div className="order-3 w-full shrink-0 lg:order-3 2xl:w-[55%] lg:w-[50%]">
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
