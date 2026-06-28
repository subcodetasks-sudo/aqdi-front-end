export default function AuthFormOnlyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-brand-background p-6">
      {children}
    </main>
  );
}
