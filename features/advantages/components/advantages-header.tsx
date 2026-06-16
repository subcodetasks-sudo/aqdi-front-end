type AdvantagesHeaderProps = {
  badge: string;
  titlePrefix: string;
  titleAccent: string;
  titleSuffix: string;
  description: string;
};

export default function AdvantagesHeader({
  badge,
  titlePrefix,
  titleAccent,
  titleSuffix,
  description,
}: AdvantagesHeaderProps) {
  return (
    <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <span className="rounded-full bg-brand-secondary/10 px-4 py-1.5 text-sm font-bold text-brand border">
        {badge}
      </span>
      <h2 className="text-3xl font-bold leading-tight md:text-4xl 2xl:text-5xl">
        <span className="text-foreground">{titlePrefix}</span>
        <span className="text-brand-secondary">{titleAccent}</span>
        <span className="text-foreground">{titleSuffix}</span>
      </h2>
      <p className="text-sm leading-relaxed  md:text-base">
        {description}
      </p>
    </header>
  );
}
