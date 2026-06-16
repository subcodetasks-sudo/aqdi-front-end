import Image from "next/image";

type AboutValuesItemProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

export default function AboutValuesItem({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
}: AboutValuesItemProps) {
  return (
    <article
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >


      <div className="space-y-4 text-center lg:text-start">
        <p className="text-sm font-semibold text-brand">{eyebrow}</p>
        <h3 className="text-4xl font-extrabold leading-tight text-brand md:text-5xl">
          {title}
        </h3>
        <p className="max-w-md text-sm leading-8 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>

      <div className="overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1024}
          height={768}
          className="h-auto w-full object-cover"
        />
      </div>
    </article>
  );
}
