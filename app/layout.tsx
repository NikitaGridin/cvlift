import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { cookies, headers } from "next/headers";
import { CookieConsent } from "@/components/cookie-consent";
import { PreferencesProvider } from "@/components/preferences-provider";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { siteLogoPath, siteMetadataBase } from "@/lib/site-url";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteMetadataBase,
  applicationName: "CVlift",
  title: {
    default: "CVlift - AI Resume Analysis and ATS Resume Checker",
    template: "%s | CVlift",
  },
  description:
    "CVlift analyzes resumes with AI, checks ATS score, finds missing keywords, matches vacancies, and helps create stronger job applications.",
  keywords: [
    "CVlift",
    "AI resume checker",
    "ATS resume checker",
    "resume score checker",
    "resume optimizer",
    "resume keywords",
    "job description resume match",
    "cover letter generator",
    "проверка резюме",
    "оценка резюме",
    "ATS проверка резюме",
    "улучшить резюме",
    "резюме под вакансию",
    "ключевые слова для резюме",
  ],
  authors: [{ name: "CVlift" }],
  creator: "CVlift",
  publisher: "CVlift",
  category: "career software",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: siteLogoPath, type: "image/svg+xml" },
    ],
    apple: [{ url: siteLogoPath, type: "image/svg+xml" }],
  },
  openGraph: {
    title: "CVlift - AI Resume Analysis and ATS Resume Checker",
    description:
      "Analyze resumes with AI, improve ATS score, match vacancies, strengthen keywords, and generate better application materials.",
    url: "/",
    siteName: "CVlift",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ru_RU"],
    images: [
      {
        url: siteLogoPath,
        width: 512,
        height: 512,
        alt: "CVlift logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVlift - AI Resume Analysis and ATS Resume Checker",
    description:
      "AI resume analysis, ATS score, vacancy matching, keyword audit, improved resume drafts, and cover letters.",
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
  const headerStore = await headers();
  const locale =
    getOptionalLocale(headerStore.get("x-cvlift-locale")) ??
    getOptionalLocale(
      cookieStore.get(localeCookieName)?.value ?? cookieStore.get(legacyLocaleCookieName)?.value,
    ) ??
    defaultLocale;

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

function getOptionalLocale(value: string | null | undefined): Locale | null {
  return isLocale(value) ? value : null;
}
