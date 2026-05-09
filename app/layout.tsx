import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import { CookieConsent } from "@/components/cookie-consent";
import { PreferencesProvider } from "@/components/preferences-provider";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvlift.app"),
  title: "CVlift - AI Resume Analysis",
  description: "Get ATS score, resume fixes, and interview insights in seconds.",
  openGraph: {
    title: "CVlift - AI Resume Analysis",
    description: "Get ATS score, resume fixes, and interview insights in seconds.",
    type: "website",
  },
};

const legacyPreferencePrefix = "cv" + "pilot";
const localeCookieName = "cvlift_locale";
const legacyLocaleCookieName = `${legacyPreferencePrefix}_locale`;

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050605",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = getLocaleCookie(
    cookieStore.get(localeCookieName)?.value ?? cookieStore.get(legacyLocaleCookieName)?.value,
  );

  return (
    <html
      lang={locale}
      data-theme="dark"
      className={`${montserrat.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#050605] text-[#F4F7F0]">
        <PreferencesProvider initialLocale={locale}>
          {children}
          <CookieConsent />
        </PreferencesProvider>
      </body>
    </html>
  );
}

function getLocaleCookie(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}
