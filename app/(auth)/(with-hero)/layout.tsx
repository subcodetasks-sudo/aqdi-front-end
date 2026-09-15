import AuthHeroPanel from "@/features/auth/components/auth-hero-panel";

export default function AuthWithHeroLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-6 lg:p-16">
      <main className="container grid items-center gap-8 lg:grid-cols-5">
        <div className="col-span-2 flex h-fit flex-col rounded-3xl bg-white lg:rounded-[48px] lg:shadow-2xl">
          {children}
        </div>
        <AuthHeroPanel />
      </main>
    </div>
  );
}
