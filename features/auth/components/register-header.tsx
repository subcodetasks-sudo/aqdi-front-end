type RegisterHeaderProps = {
  title: string;
};

export default function RegisterHeader({ title }: RegisterHeaderProps) {
  return (
    <header className="text-center">
      <h1 className="text-2xl font-bold text-brand md:text-3xl">{title}</h1>
    </header>
  );
}
