import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Layers3,
  Power,
  Radar,
  Sparkles,
  Terminal,
  Upload,
  Zap,
} from "lucide-react";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { HomeRoiSections } from "@/components/home-roi-sections";
import { LocalizedString, LocalizedText } from "@/components/localized-text";
import { PreferenceControls } from "@/components/preference-controls";
import { creditPackages, formatUsdCents } from "@/lib/credits-public";
import type { TranslationKey } from "@/lib/i18n";
import { seoPages } from "@/lib/seo-content";
import { getSessionSafely } from "@/lib/server-data";
import { absoluteUrl, siteLogoPath, siteLogoUrl } from "@/lib/site-url";

const outcomes = [
  "home.outcome.ats",
  "home.outcome.fixes",
  "home.outcome.match",
  "home.outcome.draft",
] as TranslationKey[];

const homeNavLinks = [
  { href: "/ats-resume-checker", labelKey: "marketing.nav.ats" },
  { href: "/resume-score", labelKey: "marketing.nav.resumeScore" },
  { href: "/faq", labelKey: "common.faq" },
].map((item) => ({ ...item, labelKey: item.labelKey as TranslationKey }));

const tokenPackageMeta = {
  starter: {
    nameKey: "home.tokens.starter.name",
    descriptionKey: "home.tokens.starter.description",
    signal: "quick_pass",
    meter: "44%",
    accent: "lime",
  },
  focused: {
    nameKey: "home.tokens.focused.name",
    descriptionKey: "home.tokens.focused.description",
    signal: "role_sprint",
    meter: "74%",
    accent: "purple",
  },
  career: {
    nameKey: "home.tokens.career.name",
    descriptionKey: "home.tokens.career.description",
    signal: "full_cycle",
    meter: "100%",
    accent: "lime",
  },
} satisfies Record<
  string,
  {
    nameKey: TranslationKey;
    descriptionKey: TranslationKey;
    signal: string;
    meter: string;
    accent: "lime" | "purple";
  }
>;

const homeTitle =
  "CVlift - AI Resume Checker, ATS Score and Resume Optimization";
const homeDescription =
  "CVlift analyzes resumes with AI, checks ATS score, finds missing keywords, matches vacancies, and helps create stronger job applications.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  keywords: [
    "AI resume checker",
    "ATS resume checker",
    "resume score checker",
    "resume optimizer",
    "resume job match",
    "resume keywords",
    "cover letter generator",
    "проверка резюме онлайн",
    "оценка резюме онлайн",
    "AI анализ резюме",
    "ATS проверка резюме",
    "резюме под вакансию",
    "улучшить резюме",
    "ключевые слова резюме",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
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
    title: homeTitle,
    description: homeDescription,
    images: [siteLogoPath],
  },
};

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CVlift",
    url: absoluteUrl("/"),
    logo: siteLogoUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CVlift",
    url: absoluteUrl("/"),
    inLanguage: ["en-US", "ru-RU"],
    description: homeDescription,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CVlift",
    url: absoluteUrl("/"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: ["en-US", "ru-RU"],
    description: homeDescription,
    image: siteLogoUrl,
    provider: {
      "@type": "Organization",
      name: "CVlift",
      logo: siteLogoUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
];
const homeJsonLdHtml = JSON.stringify(homeJsonLd).replace(/</g, "\\u003c");

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSessionSafely();
  const isSignedIn = Boolean(session?.user?.id);
  const useCaseCards = [
    ...seoPages.slice(0, 2),
    ...seoPages.slice(-1),
    ...seoPages.slice(2, -1),
  ];

  return (
    <main className="cvlift-home min-h-screen overflow-hidden bg-[#050605] text-[#F4F7F0]">
      <div className="cvlift-scanline" />
      <section className="cvlift-hero relative border-b border-[#B7FF00]/10">
        <CyberHeader isSignedIn={isSignedIn} />

        <div className="cvlift-hero-inner mx-auto flex w-full max-w-[1180px] flex-col items-center gap-14 px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="cvlift-hero-copy relative z-10 mx-auto flex max-w-5xl flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#B7FF00]/25 bg-[#B7FF00]/8 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#B7FF00] shadow-[0_0_28px_rgba(183,255,0,0.12)]">
              <span className="size-1.5 rounded-full bg-[#B7FF00] shadow-[0_0_14px_rgba(183,255,0,0.9)]" />
              <LocalizedText k="home.badge" />
            </div>

            <h1 className="cvlift-hero-title mx-auto max-w-5xl text-5xl font-bold leading-[0.94] tracking-normal text-white sm:text-6xl lg:text-[82px]">
              <span className="block">
                <LocalizedText k="home.title" />
              </span>
              <span className="cvlift-gradient-text block">
                <LocalizedText k="home.outcome.match" />
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl font-mono text-sm font-medium leading-7 text-[#92988E]">
              <LocalizedText k="home.description" />
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              {isSignedIn ? (
                <Link href="/upload" className="cvlift-primary-button">
                  <LocalizedText k="home.primarySignedIn" />
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              ) : (
                <GoogleSignInButton
                  className="cvlift-primary-button"
                  redirectTo="/upload"
                >
                  <LocalizedText k="home.primarySignedOut" />
                </GoogleSignInButton>
              )}
              <Link href="/faq" className="cvlift-secondary-button">
                <Terminal aria-hidden="true" className="size-4" />
                <LocalizedText k="common.readFaq" />
              </Link>
            </div>

            <div className="cvlift-outcome-grid mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {outcomes.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#DCE7D1]"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-4 text-[#B7FF00]"
                  />
                  <LocalizedText k={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeRoiSections isSignedIn={isSignedIn} />

      <section id="metrics" className="bg-[#050605]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-5 px-4 py-20 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8 lg:py-24">
          <div className="cvlift-panel cvlift-use-case-card cvlift-use-case-intro border border-white/8 bg-[#080A07] p-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#B7FF00]">
              / metrics
            </p>
            <h2 className="cvlift-card-title mt-5 text-xl font-black tracking-normal text-white">
              <LocalizedText k="home.useCases.title" />
            </h2>
            <p className="mt-4 font-mono text-xs font-medium leading-6 text-[#92988E]">
              <LocalizedText k="home.useCases.text" />
            </p>
          </div>

          {useCaseCards.map((page, index) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="cvlift-panel cvlift-use-case-card group border border-white/8 bg-[#080A07] p-6 transition duration-300 hover:bg-[#0C1008]"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9B5CFF]">
                  <LocalizedString value={page.eyebrow} />
                </span>
                <span className="font-mono text-[10px] font-bold text-[#666C61]">
                  node_0{index + 5}
                </span>
              </div>
              <h3 className="cvlift-card-title text-xl font-black tracking-normal text-white">
                <LocalizedString value={page.title} />
              </h3>
              <p className="mt-3 min-h-14 font-mono text-xs font-medium leading-6 text-[#92988E]">
                <LocalizedString value={page.description} />
              </p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#B7FF00]/10 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#B7FF00] transition duration-300 group-hover:bg-[#B7FF00] group-hover:text-black">
                <LocalizedText k="home.useCases.openPage" />
                <ArrowRight aria-hidden="true" className="size-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <BottomCta isSignedIn={isSignedIn} />

      <TokenPurchaseSection />

      <footer className="bg-[#050605]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-4 py-8 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#666C61] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© 2026 CVlift</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="transition hover:text-[#B7FF00]">
              <LocalizedText k="marketing.footer.privacy" />
            </Link>
            <Link href="/terms" className="transition hover:text-[#B7FF00]">
              <LocalizedText k="marketing.footer.terms" />
            </Link>
            <Link href="/faq" className="transition hover:text-[#B7FF00]">
              <LocalizedText k="common.faq" />
            </Link>
            <Link href="/requisites" className="transition hover:text-[#B7FF00]">
              <LocalizedText k="marketing.footer.requisites" />
            </Link>
          </div>
        </div>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeJsonLdHtml }}
      />
    </main>
  );
}

function BottomCta({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section className="cvlift-bottom-cta border-y border-white/8 bg-[#0B0C0A]">
      <div className="mx-auto grid w-full max-w-[1180px] gap-7 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8 lg:py-28">
        <div className="cvlift-bottom-copy">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B7FF00]/25 bg-[#B7FF00]/8 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#B7FF00]">
            <Power aria-hidden="true" className="size-3.5" />
            <LocalizedText k="home.cta.eyebrow" />
          </div>

          <h2 className="cvlift-section-title mt-7 max-w-3xl text-4xl font-black tracking-normal text-white sm:text-5xl">
            <LocalizedText k="home.cta.title" />
          </h2>
          <p className="mt-5 max-w-2xl font-mono text-xs font-medium leading-6 text-[#92988E]">
            <LocalizedText k="home.cta.text" />
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isSignedIn ? (
              <Link href="/upload" className="cvlift-primary-button">
                <Upload aria-hidden="true" className="size-4" />
                <LocalizedText k="home.primarySignedIn" />
              </Link>
            ) : (
              <GoogleSignInButton
                className="cvlift-primary-button"
                redirectTo="/upload"
              >
                <LocalizedText k="home.cta.google" />
              </GoogleSignInButton>
            )}
            <Link href="/resume-keywords" className="cvlift-secondary-button">
              <Radar aria-hidden="true" className="size-4" />
              <LocalizedText k="home.cta.secondary" />
            </Link>
          </div>
        </div>

        <div className="cvlift-cta-console">
          <div className="cvlift-cta-orbit" aria-hidden="true">
            <span className="cvlift-cta-ring cvlift-cta-ring-1" />
            <span className="cvlift-cta-ring cvlift-cta-ring-2" />
            <span className="cvlift-cta-core">
              <Power className="size-6" />
            </span>
          </div>

          <div className="cvlift-cta-status-grid">
            <StatusSignal label="ats_ready" value="98" width="92%" />
            <StatusSignal label="impact_map" value="+31" width="78%" />
            <StatusSignal label="keywords" value="94" width="88%" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusSignal({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className="cvlift-cta-status">
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div
          className="cvlift-cta-status-bar"
          style={{ "--signal-width": width } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

function TokenPurchaseSection() {
  return (
    <section
      id="tokens"
      className="cvlift-token-section border-b border-white/8 bg-[#050605]"
    >
      <div className="mx-auto w-full max-w-[1180px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#9B5CFF]/30 bg-[#9B5CFF]/10 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#C9A8FF]">
            <Coins aria-hidden="true" className="size-3.5" />
            <LocalizedText k="home.tokens.eyebrow" />
          </div>
          <h2 className="cvlift-section-title mt-6 text-4xl font-black tracking-normal text-white sm:text-5xl">
            <LocalizedText k="home.tokens.title" />
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-mono text-xs font-medium leading-6 text-[#92988E]">
            <LocalizedText k="home.tokens.text" />
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-sm gap-3 font-mono text-[11px] font-bold text-[#DCE7D1] sm:grid-cols-2">
          <div className="cvlift-token-note justify-center">
            <Layers3 aria-hidden="true" className="size-4 text-[#B7FF00]" />
            <LocalizedText k="home.tokens.perAnalysis" />
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {creditPackages.map((item, index) => {
            const meta =
              tokenPackageMeta[item.id as keyof typeof tokenPackageMeta] ??
              tokenPackageMeta.starter;
            const isPopular = Boolean(item.badge);

            return (
              <article
                key={item.id}
                className={`cvlift-token-card cvlift-token-card-${meta.accent} ${isPopular ? "cvlift-token-card-popular" : ""}`}
                style={
                  { "--card-delay": `${index * -0.8}s` } as React.CSSProperties
                }
              >
                {isPopular ? (
                  <span className="cvlift-token-badge">
                    <Sparkles aria-hidden="true" className="size-3" />
                    <LocalizedText k="home.tokens.popular" />
                  </span>
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black tracking-normal text-white">
                      <LocalizedText k={meta.nameKey} />
                    </h3>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#777D72]">
                      {meta.signal}
                    </p>
                  </div>
                  <span className="cvlift-token-price">
                    {formatUsdCents(item.amountUsdCents)}
                  </span>
                </div>

                <div className="mt-7">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#777D72]">
                    <LocalizedText k="home.tokens.balance" />
                  </p>
                  <p className="mt-1 flex items-end gap-2">
                    <span className="text-5xl font-black leading-none text-white">
                      {item.credits}
                    </span>
                    <span className="pb-1 font-mono text-xs font-black uppercase tracking-[0.12em] text-[#B7FF00]">
                      <LocalizedText k="home.tokens.units" />
                    </span>
                  </p>
                </div>

                <p className="mt-5 min-h-20 font-mono text-xs font-medium leading-6 text-[#92988E]">
                  <LocalizedText k={meta.descriptionKey} />
                </p>

                <div className="cvlift-token-meter" aria-hidden="true">
                  <span style={{ width: meta.meter }} />
                </div>

                <span className="cvlift-token-status-badge">
                  <LocalizedText k="home.tokens.mock" />
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CyberHeader({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <header className="relative z-20 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex min-h-16 w-full max-w-[1180px] flex-wrap items-center justify-center gap-3 rounded-[28px] border border-white/8 bg-black/50 px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:justify-between sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[#B7FF00] text-black">
            <Zap aria-hidden="true" className="size-4 fill-black" />
          </span>
          <span className="font-mono text-sm font-black tracking-normal text-white">
            CVlift
          </span>
        </Link>

        <div className="hidden items-center gap-7 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#777D72] md:flex">
          {homeNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#B7FF00]"
            >
              <LocalizedText k={link.labelKey} />
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="block">
            <PreferenceControls />
          </div>
          {isSignedIn ? (
            <Link href="/upload" className="cvlift-header-button">
              <LocalizedText k="marketing.header.upload" />
            </Link>
          ) : (
            <GoogleSignInButton
              className="cvlift-header-button"
              redirectTo="/upload"
            >
              <LocalizedText k="marketing.header.signIn" />
            </GoogleSignInButton>
          )}
        </div>
      </nav>
    </header>
  );
}
