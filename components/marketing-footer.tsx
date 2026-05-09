import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LocalizedString, LocalizedText } from "@/components/localized-text";
import { seoPages } from "@/lib/seo-content";

export function MarketingFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1240px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Link href="/" className="flex w-fit items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-[#6366F1] text-white shadow-[0_14px_32px_rgba(99,102,241,0.22)]">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <span className="text-base font-bold text-[#0F172A]">CVlift</span>
            </Link>
            <p className="mt-4 max-w-md text-sm font-medium leading-6 text-[#64748B]">
              <LocalizedText k="marketing.footer.description" />
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FooterGroup
              title={<LocalizedText k="marketing.footer.product" />}
              links={[
                [<LocalizedText key="upload" k="common.uploadResume" />, "/upload"],
                [<LocalizedText key="history" k="common.history" />, "/history"],
                [<LocalizedText key="faq" k="common.faq" />, "/faq"],
              ]}
            />
            <FooterGroup
              title={<LocalizedText k="marketing.footer.legal" />}
              links={[
                [<LocalizedText key="privacy" k="marketing.footer.privacy" />, "/privacy"],
                [<LocalizedText key="terms" k="marketing.footer.terms" />, "/terms"],
                [<LocalizedText key="cookies" k="marketing.footer.cookies" />, "/cookies"],
                [
                  <LocalizedText key="requisites" k="marketing.footer.requisites" />,
                  "/requisites",
                ],
              ]}
            />
            <FooterGroup
              title={<LocalizedText k="marketing.footer.useCases" />}
              links={seoPages.map((page) => [
                <LocalizedString key={page.slug} value={page.title} />,
                `/${page.slug}`,
              ])}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: React.ReactNode;
  links: Array<[React.ReactNode, string]>;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
      <div className="mt-3 grid gap-2">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="text-sm font-semibold leading-6 text-[#64748B] transition duration-200 hover:text-[#6366F1]"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
