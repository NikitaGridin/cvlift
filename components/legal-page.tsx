import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { LocalizedString } from "@/components/localized-text";
import type { LocalizedValue } from "@/lib/i18n";

export type LegalSection = {
  title: LocalizedValue<string>;
  text: LocalizedValue<string>;
  bullets?: Array<LocalizedValue<string>>;
};

type LegalPageProps = {
  title: LocalizedValue<string>;
  description: LocalizedValue<string>;
  sections: LegalSection[];
};

export function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[#FAFBFC] text-[#0F172A]">
      <MarketingHeader />

      <section className="mx-auto w-full max-w-[980px] px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <p className="text-sm font-bold text-[#6366F1]">
          <LocalizedString value={{ ru: "Документы OfferLyra" }} />
        </p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#0F172A] sm:text-6xl">
          <LocalizedString value={title} />
        </h1>
        <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-[#64748B]">
          <LocalizedString value={description} />
        </p>
        <p className="mt-4 text-sm font-semibold text-[#94A3B8]">
          <LocalizedString
            value={{ ru: "Обновлено: 9 мая 2026" }}
          />
        </p>

        <div className="mt-10 grid gap-4">
          {sections.map((section) => (
            <article
              key={section.title.ru}
              className="rounded-[24px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl"
            >
              <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                <LocalizedString value={section.title} />
              </h2>
              <p className="mt-3 text-base font-medium leading-7 text-[#64748B]">
                <LocalizedString value={section.text} />
              </p>
              {section.bullets?.length ? (
                <ul className="mt-5 grid gap-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet.ru} className="text-sm font-semibold leading-6 text-[#0F172A]">
                      <LocalizedString value={bullet} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
