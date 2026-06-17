import Footer from "@/features/footer/components/footer";
import NavbarShell from "@/features/shared/components/navbar-shell";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarShell />
      {children}
      <Footer />
    </>
  );
}
