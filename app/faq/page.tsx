import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";
import { LocalizedString, LocalizedText } from "@/components/localized-text";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { faqItems } from "@/lib/seo-content";

export const metadata: Metadata = {
  title: "FAQ | CVlift",
  description:
    "Answers about CVlift resume scoring, ATS checks, vacancy matching, improved resumes, and cover letters.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.en,
      },
    })),
  };
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <main className="min-h-screen bg-[#FAFBFC] text-[#0F172A]">
      <MarketingHeader />

      <section className="mx-auto w-full max-w-[980px] px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-[22px] bg-[#6366F1]/10 text-[#6366F1]">
            <HelpCircle aria-hidden="true" className="size-7" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-[#0F172A] sm:text-6xl">
            <LocalizedString value={{ en: "CVlift FAQ", ru: "FAQ CVlift" }} />
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-[#64748B]">
            <LocalizedString
              value={{
                en: "Everything candidates usually ask before scoring a resume, comparing it with a vacancy, or generating a stronger version.",
                ru: "Все, что кандидаты обычно спрашивают перед оценкой резюме, сравнением с вакансией или созданием более сильной версии.",
              }}
            />
          </p>
        </div>

        <div className="mt-10 grid gap-3">
          {faqItems.map((item) => (
            <details
              key={item.question.en}
              className="group rounded-[22px] border border-black/[0.06] bg-white/75 p-5 shadow-sm backdrop-blur-xl"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-[#0F172A] [&::-webkit-details-marker]:hidden">
                <span>
                  <LocalizedString value={item.question} />
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[#64748B] transition duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm font-medium leading-6 text-[#64748B]">
                <LocalizedString value={item.answer} />
              </p>
            </details>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-black/[0.06] bg-[#0F172A] p-6 text-white shadow-[0_34px_100px_rgba(15,23,42,0.2)] sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                <LocalizedString
                  value={{
                    en: "Ready to check your resume?",
                    ru: "Готовы проверить резюме?",
                  }}
                />
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-[#CBD5E1]">
                <LocalizedString
                  value={{
                    en: "Upload a resume, choose general or vacancy mode, and get specific fixes.",
                    ru: "Загрузите резюме, выберите общий режим или вакансию и получите конкретные правки.",
                  }}
                />
              </p>
            </div>
            <Link
              href="/login"
              className="cvlift-primary-button"
            >
              <LocalizedText k="common.startAnalysis" />
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/ats-resume-checker"
            className="text-sm font-bold text-[#6366F1] transition duration-200 hover:text-[#4F46E5]"
          >
            <LocalizedString
              value={{
                en: "Read the ATS resume checker guide",
                ru: "Читать гид по ATS-проверке резюме",
              }}
            />
          </Link>
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
