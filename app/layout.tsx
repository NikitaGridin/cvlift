import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { PreferencesProvider } from "@/components/preferences-provider";
import { defaultLocale } from "@/lib/i18n";
import { siteLogoPath, siteMetadataBase } from "@/lib/site-url";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteMetadataBase,
  applicationName: "OfferLyra",
  title: {
    default: "OfferLyra - AI-платформа подготовки к собеседованию",
    template: "%s | OfferLyra",
  },
  description:
    "OfferLyra помогает подготовиться к собеседованию: AI-тренажёр вопросов, HR-скрининг, техническое интервью, создание, анализ и перевод резюме.",
  keywords: [
    "OfferLyra",
    "подготовка к собеседованию",
    "тренажер собеседований",
    "AI собеседование",
    "ИИ интервьюер",
    "техническое собеседование",
    "HR скрининг",
    "вопросы для собеседования",
    "анализ резюме",
    "перевод резюме",
  ],
  authors: [{ name: "OfferLyra" }],
  creator: "OfferLyra",
  publisher: "OfferLyra",
  category: "career software",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: siteLogoPath, type: "image/svg+xml" }],
  },
  openGraph: {
    title: "OfferLyra - AI-платформа подготовки к собеседованию",
    description:
      "Готовьтесь к интервью с AI: тренажёр вопросов, HR-скрининг, техническое собеседование, резюме, анализ и перевод.",
    url: "/",
    siteName: "OfferLyra",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: siteLogoPath,
        width: 512,
        height: 512,
        alt: "Логотип OfferLyra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OfferLyra - AI-платформа подготовки к собеседованию",
    description:
      "AI-тренажёр собеседований, HR-скрининг, техническое интервью, создание, анализ и перевод резюме.",
    images: [siteLogoPath],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050605",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      data-theme="dark"
      className={`${montserrat.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#050605] text-[#F4F7F0]">
        <PreferencesProvider initialLocale={defaultLocale}>
          {children}
          <CookieConsent />
        </PreferencesProvider>
      </body>
    </html>
  );
}
