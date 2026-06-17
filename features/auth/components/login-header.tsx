type LoginHeaderProps = {
  greeting: string;
  subtitle: string;
};

export default function LoginHeader({ greeting, subtitle }: LoginHeaderProps) {
  return (
    <header className="space-y-2 text-center">
      <p className="text-5xl" aria-hidden="true">
        👋
      </p>
      <h1 className="text-2xl font-bold text-brand md:text-3xl">
        {greeting}
      </h1>
      <p className="text-sm text-gray-600 md:text-base">{subtitle}</p>
    </header>
  );
}
