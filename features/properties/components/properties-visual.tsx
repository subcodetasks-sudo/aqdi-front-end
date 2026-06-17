import Image from "next/image";

type PropertiesVisualProps = {
  alt: string;
};

export default function PropertiesVisual({ alt }: PropertiesVisualProps) {
  return (
    <div className="w-full shrink-0 lg:w-[60%]">
      <div className="overflow-hidden ">
        <Image
          src="/images/properties.png"
          alt={alt}
          width={3392}
          height={2948}
          className="h-auto w-full object-contain"
          priority
        />
      </div>
    </div>
  );
}
