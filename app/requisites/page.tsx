import type { Metadata } from "next";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { LocalizedString } from "@/components/localized-text";
import { localized as l } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Requisites | CVlift",
  description: "CVlift business requisites: INN and OGRNIP.",
  alternates: {
    canonical: "/requisites",
  },
};

export default function RequisitesPage() {
  return (
    <main className="min-h-screen bg-[#FAFBFC] text-[#0F172A]">
      <MarketingHeader />

      <section className="mx-auto w-full max-w-[980px] px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <p className="text-sm font-bold text-[#6366F1]">
          <LocalizedString value={l("CVlift legal", "Документы CVlift")} />
        </p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#0F172A] sm:text-6xl">
          <LocalizedString value={l("Business Requisites", "Реквизиты")} />
        </h1>
        <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-[#64748B]">
          <LocalizedString
            value={l(
              "Public business details for CVlift.",
              "Публичные реквизиты сервиса CVlift.",
            )}
          />
        </p>

        <div className="mt-10 rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <dl className="grid gap-4">
            <div className="rounded-[22px] border border-black/[0.06] bg-[#FAFBFC] p-5">
              <dt className="text-sm font-bold text-[#64748B]">ИНН</dt>
              <dd className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
                524926546810
              </dd>
            </div>
            <div className="rounded-[22px] border border-black/[0.06] bg-[#FAFBFC] p-5">
              <dt className="text-sm font-bold text-[#64748B]">ОГРНИП</dt>
              <dd className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
                326527500046888
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
