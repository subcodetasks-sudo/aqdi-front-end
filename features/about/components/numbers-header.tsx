type NumbersHeaderProps = {
  badge: string;
  title: string;
  description: string;
};

export default function NumbersHeader({
  badge,
  title,
  description,
}: NumbersHeaderProps) {
  return (
    <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <span className="rounded-full border bg-brand-secondary/10 px-4 py-1.5 text-sm font-bold text-brand">
        {badge}
      </span>
      <h2 className="text-3xl font-extrabold leading-tight text-brand md:text-4xl 2xl:text-5xl">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {description}
      </p>
    </header>
  );
}
