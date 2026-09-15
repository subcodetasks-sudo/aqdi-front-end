import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { DirectionProvider } from "@/components/ui/direction";
import Providers from "@/app/providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import WebsiteClosedScreen from "@/features/website-status/components/website-closed-screen";
import { getWebsiteStatus } from "@/features/website-status/services/get-website-status";
import { getWebsiteClosedView } from "@/features/website-status/utils/get-website-closed-view";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  // Only weights used in UI (medium/semibold/bold/extrabold→700).
  // Loading 100–300 roughly doubles Arabic font payload and hurts mobile TBT/LCP.
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    openGraph: {
      title,
      description,
      siteName: title,
      locale: "ar_SA",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

const RTL_LOCALES = new Set(["ar", "fa", "he", "ur"]);

function getDirection(locale: string) {
  const baseLocale = locale.toLowerCase().split("-")[0];
  return RTL_LOCALES.has(baseLocale) ? "rtl" : "ltr";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages, websiteStatus] = await Promise.all([
    getLocale(),
    getMessages(),
    getWebsiteStatus(),
  ]);
  const direction = getDirection(locale);

  // Boot check — before rendering routes. When the backend reports the website
  // as closed we render only the maintenance notice (no home / auth / contracts).
  const closedView = websiteStatus.isOpen
    ? null
    : await getWebsiteClosedView(websiteStatus, locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${ibmPlexSansArabic.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {closedView ? (
          <WebsiteClosedScreen view={closedView} />
        ) : (
          <Providers>
            <DirectionProvider dir={direction} direction={direction}>
              <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
                <Toaster position="top-center" />
              </NextIntlClientProvider>
            </DirectionProvider>
          </Providers>
        )}
      </body>
    </html>
  );
}
