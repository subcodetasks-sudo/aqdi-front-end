import CustomIcon from "@/features/shared/components/custom-icon";

type AboutCoreValueItemProps = {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
};

export default function AboutCoreValueItem({
  icon,
  eyebrow,
  title,
  description,
}: AboutCoreValueItemProps) {
  return (
    <article className="flex flex-col items-center gap-3 px-6 py-4 text-center md:gap-4 md:px-10 md:py-6">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand text-white md:size-16">
        <CustomIcon src={icon} size={28} className="text-white" />
      </span>
      <p className="text-xs font-medium text-foreground/50 md:text-sm">{eyebrow}</p>
      <h3 className="text-lg font-extrabold leading-snug text-foreground md:text-xl">
        {title}
      </h3>
      <p className="max-w-xs text-sm leading-7 text-foreground/60">{description}</p>
    </article>
  );
}
