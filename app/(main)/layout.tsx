import Footer from "@/features/footer/components/footer";
import HashScrollHandler from "@/features/shared/components/hash-scroll-handler";
import NavbarShell from "@/features/shared/components/navbar-shell";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HashScrollHandler />
      <NavbarShell />
      {children}
      <Footer />
    </>
  );
}
