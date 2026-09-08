import Image from "next/image";

type PropertiesVisualProps = {
  alt: string;
};

export default function PropertiesVisual({ alt }: PropertiesVisualProps) {
  return (
    <div className="w-full shrink-0 lg:w-[60%]">
      <div className="overflow-hidden ">
        <Image
        src="/images/properties.webp"
          alt={alt}
          width={1200}
          height={1040}
          className="h-auto w-full object-contain"
          sizes="(max-width: 1023px) 100vw, 60vw"
          quality={75}
          priority
        />
      </div>
    </div>
  );
}
