import Link from "next/link";
import { Sparkles } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { LocalizedText } from "@/components/localized-text";
import { PreferenceControls } from "@/components/preference-controls";
import type { TranslationKey } from "@/lib/i18n";

type MarketingHeaderProps = {
  isSignedIn?: boolean;
};

const links = [
  { href: "/ats-resume-checker", labelKey: "marketing.nav.ats" },
  { href: "/resume-score", labelKey: "marketing.nav.resumeScore" },
  { href: "/faq", labelKey: "common.faq" },
].map((item) => ({ ...item, labelKey: item.labelKey as TranslationKey }));

export function MarketingHeader({ isSignedIn = false }: MarketingHeaderProps) {
  return (
    <nav className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-[#6366F1] text-white shadow-[0_14px_32px_rgba(99,102,241,0.28)]">
          <Sparkles aria-hidden="true" className="size-5" />
        </span>
        <span className="text-base font-bold">CVlift</span>
      </Link>

      <div className="hidden items-center gap-1 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full px-4 py-2 text-sm font-bold text-[#64748B] transition duration-200 hover:bg-white/75 hover:text-[#0F172A]"
          >
            <LocalizedText k={link.labelKey} />
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <PreferenceControls />
        {isSignedIn ? (
          <Link
            href="/upload"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white/75 px-4 text-sm font-semibold text-[#0F172A] shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white"
          >
            <LocalizedText k="marketing.header.upload" />
          </Link>
        ) : (
          <GoogleSignInButton
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white/75 px-4 text-sm font-semibold text-[#0F172A] shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white"
            redirectTo="/upload"
          >
            <LocalizedText k="marketing.header.signIn" />
          </GoogleSignInButton>
        )}
      </div>
    </nav>
  );
}
