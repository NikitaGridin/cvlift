import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { LocalizedString, LocalizedText } from "@/components/localized-text";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import {
  getSeoPageKeywords,
  getSeoPageLanguageAlternates,
  getSeoPagePath,
  type SeoPage,
} from "@/lib/seo-content";
import { absoluteUrl, siteLogoPath, siteLogoUrl } from "@/lib/site-url";
import {
  translate,
  type Locale,
  type LocalizedValue,
  type TranslationKey,
} from "@/lib/i18n";

export function getSeoLandingMetadata(page: SeoPage, locale: Locale = "en"): Metadata {
  const canonicalPath = getSeoPagePath(page, locale);
  const title = page.metaTitle[locale];
  const description = page.metaDescription[locale];

  return {
    title,
    description,
    keywords: getSeoPageKeywords(page, locale),
    alternates: {
      canonical: canonicalPath,
      languages: getSeoPageLanguageAlternates(page),
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "CVlift",
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      alternateLocale: locale === "ru" ? ["en_US"] : ["ru_RU"],
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
      title,
      description,
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
  };
}

export function SeoLandingPage({
  page,
  locale,
}: {
  page: SeoPage;
  locale?: Locale;
}) {
  const contentLocale = locale ?? "en";
  const canonicalPath = getSeoPagePath(page, contentLocale);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.metaTitle[contentLocale],
      description: page.metaDescription[contentLocale],
      url: absoluteUrl(canonicalPath),
      image: siteLogoUrl,
      inLanguage: contentLocale === "ru" ? "ru-RU" : "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "CVlift",
        url: absoluteUrl("/"),
      },
      publisher: {
        "@type": "Organization",
        name: "CVlift",
        logo: siteLogoUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "CVlift",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title[contentLocale],
          item: absoluteUrl(canonicalPath),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((item) => ({
        "@type": "Question",
        name: item.question[contentLocale],
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer[contentLocale],
        },
      })),
    },
  ];
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
  const questionHeading = {
    en: `Common questions about ${page.title.en.toLowerCase()}`,
    ru: `Частые вопросы: ${page.title.ru.toLowerCase()}`,
  };

  return (
    <main className="min-h-screen bg-[#FAFBFC] text-[#0F172A]">
      <MarketingHeader />

      <section className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-16 lg:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/75 px-4 py-2 text-sm font-bold text-[#4F46E5] shadow-sm backdrop-blur">
            <Sparkles aria-hidden="true" className="size-4" />
            <SeoLocalizedString value={page.eyebrow} locale={locale} />
          </div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.03] text-[#0F172A] sm:text-6xl">
            <SeoLocalizedString value={page.title} locale={locale} />
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#64748B]">
            <SeoLocalizedString value={page.description} locale={locale} />
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <GoogleSignInButton
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#6366F1] px-7 text-sm font-bold text-white shadow-[0_16px_40px_rgba(99,102,241,0.26)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#4F46E5]"
              redirectTo="/upload"
            >
              <SeoLocalizedString value={page.cta} locale={locale} />
            </GoogleSignInButton>
            <Link
              href="/faq"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white/75 px-7 text-sm font-bold text-[#0F172A] shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white"
            >
              <SeoLocalizedText k="common.readFaq" locale={locale} />
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl">
          <h2 className="text-xl font-bold text-[#0F172A]">
            <SeoLocalizedString
              value={{ en: "What CVlift checks", ru: "Что проверяет CVlift" }}
              locale={locale}
            />
          </h2>
          <div className="mt-5 grid gap-3">
            {page.bullets.map((bullet) => (
              <div
                key={bullet.en}
                className="flex gap-3 rounded-[20px] bg-[#FAFBFC] p-4"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-[#22C55E]"
                />
                <p className="text-sm font-semibold leading-6 text-[#0F172A]">
                  <SeoLocalizedString value={bullet} locale={locale} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1240px] gap-4 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        {page.sections.map((section) => (
          <article
            key={section.title.en}
            className="rounded-[24px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              <SeoLocalizedString value={section.title} locale={locale} />
            </h2>
            <p className="mt-3 text-base font-medium leading-7 text-[#64748B]">
              <SeoLocalizedString value={section.text} locale={locale} />
            </p>
            <ul className="mt-5 grid gap-3">
              {section.bullets.map((bullet) => (
                <li
                  key={bullet.en}
                  className="flex gap-3 text-sm font-semibold leading-6 text-[#0F172A]"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-[#22C55E]"
                  />
                  <SeoLocalizedString value={bullet} locale={locale} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <p className="text-sm font-bold text-[#6366F1]">
            <SeoLocalizedString
              value={{ en: "Questions", ru: "Вопросы" }}
              locale={locale}
            />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#0F172A]">
            <SeoLocalizedString value={questionHeading} locale={locale} />
          </h2>
          <div className="mt-8 grid gap-3">
            {page.faqs.map((item) => (
              <details
                key={item.question.en}
                className="group rounded-[20px] bg-[#FAFBFC] p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-[#0F172A] [&::-webkit-details-marker]:hidden">
                  <span>
                    <SeoLocalizedString value={item.question} locale={locale} />
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 text-[#64748B] transition duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 text-sm font-medium leading-6 text-[#64748B]">
                  <SeoLocalizedString value={item.answer} locale={locale} />
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="seo-cta-card rounded-[28px] border border-black/[0.06] bg-[#0F172A] p-6 text-white shadow-[0_34px_100px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold text-[#A5B4FC]">
                <SeoLocalizedText k="home.cta.eyebrow" locale={locale} />
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight">
                <SeoLocalizedString
                  value={{
                    en: "Upload your resume and get a clearer application strategy.",
                    ru: "Загрузите резюме и получите более ясную стратегию отклика.",
                  }}
                  locale={locale}
                />
              </h2>
            </div>
            <GoogleSignInButton
              className="seo-cta-button cvlift-primary-button"
              redirectTo="/upload"
            >
              <SeoLocalizedText k="common.startAnalysis" locale={locale} />
            </GoogleSignInButton>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />
    </main>
  );
}

function SeoLocalizedString({
  value,
  locale,
}: {
  value: LocalizedValue<string>;
  locale?: Locale;
}) {
  if (locale) {
    return <>{value[locale]}</>;
  }

  return <LocalizedString value={value} />;
}

function SeoLocalizedText({ k, locale }: { k: TranslationKey; locale?: Locale }) {
  if (locale) {
    return <>{translate(locale, k)}</>;
  }

  return <LocalizedText k={k} />;
}
