import Link from "next/link";
import { Coins, Sparkles, UserCircle } from "lucide-react";
import { AppNavigation } from "@/components/app-navigation";
import { SignOutButton } from "@/components/auth-buttons";
import { LocalizedString, LocalizedText } from "@/components/localized-text";
import { PreferenceControls } from "@/components/preference-controls";
import { getAnalysisCreditCost, getWalletSummary } from "@/lib/credits";
import { getSessionSafely } from "@/lib/server-data";

type AppShellProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  hideHeader?: boolean;
  children: React.ReactNode;
};

export async function AppShell({
  title,
  subtitle,
  hideHeader = false,
  children,
}: AppShellProps) {
  const session = await getSessionSafely();
  const wallet = session?.user?.id
    ? await getWalletSummary(session.user.id)
    : null;
  const isFreeAnalysis = getAnalysisCreditCost() === 0;

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#0F172A]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:gap-8 lg:py-8">
        <aside className="sticky top-4 z-20 rounded-[24px] border border-black/[0.06] bg-white/75 px-3 py-3 shadow-sm backdrop-blur-xl lg:h-[calc(100vh-64px)] lg:w-64 lg:px-4 lg:py-5">
          <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-stretch">
            <Link href="/" className="flex items-center gap-3 px-2">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-[#6366F1] text-white shadow-[0_14px_32px_rgba(99,102,241,0.28)]">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <span className="hidden text-base font-bold tracking-tight sm:inline">
                OfferLyra
              </span>
            </Link>

            <AppNavigation />

            <div className="hidden lg:block">
              <PreferenceControls />
            </div>

            <div className="hidden flex-1 lg:block" />

            {session?.user ? (
              <div className="hidden space-y-3 lg:block">
                <Link
                  href="/credits"
                  className="flex items-center justify-between gap-3 rounded-[22px] border border-[#6366F1]/15 bg-[#6366F1]/8 p-3 transition duration-200 hover:-translate-y-0.5 hover:bg-[#6366F1]/12"
                >
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#6366F1]">
                      <LocalizedText k="common.balance" />
                    </span>
                    <span className="mt-1 block text-sm font-bold text-[#0F172A]">
                      {isFreeAnalysis ? (
                        <LocalizedText k="common.freeMode" />
                      ) : (
                        <LocalizedString
                          value={{
                            ru: `${wallet?.balance ?? 0} токенов`,
                          }}
                        />
                      )}
                    </span>
                  </span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6366F1] shadow-sm">
                    <Coins aria-hidden="true" className="size-4" />
                  </span>
                </Link>
                <div className="rounded-[22px] border border-black/[0.06] bg-[#FAFBFC] p-3">
                  <p className="truncate text-sm font-bold text-[#0F172A]">
                    {session.user.name ?? <LocalizedText k="common.signedIn" />}
                  </p>
                  <p className="truncate text-xs font-medium text-[#64748B]">
                    {session.user.email}
                  </p>
                  <SignOutButton className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 text-sm font-semibold text-[#0F172A] transition duration-200 hover:bg-[#F8FAFC]">
                    <LocalizedText k="common.signOut" />
                  </SignOutButton>
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <main className={`min-w-0 flex-1 ${hideHeader ? "pb-0" : "pb-4"}`}>
          {hideHeader ? null : (
            <header className="mb-8 flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-end lg:pt-0">
              <div className="min-w-0">
                <p className="mb-3 text-sm font-semibold text-[#6366F1]">
                  <LocalizedText k="appShell.eyebrow" />
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[#64748B]">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              {session?.user ? (
                <div className="lg:hidden">
                  <div className="flex flex-wrap items-center gap-2">
                    <PreferenceControls />
                    <Link
                      href="/credits"
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-[#6366F1]/15 bg-[#6366F1]/8 px-3 text-sm font-bold text-[#4F46E5] shadow-sm"
                    >
                      <Coins aria-hidden="true" className="size-4" />
                      {isFreeAnalysis ? (
                        <LocalizedText k="common.free" />
                      ) : (
                        (wallet?.balance ?? 0)
                      )}
                    </Link>
                    <div className="min-w-0 rounded-full border border-black/[0.06] bg-white/75 px-3 py-2 shadow-sm backdrop-blur-xl">
                      <p className="flex max-w-[190px] items-center gap-2 truncate text-sm font-bold text-[#0F172A]">
                        <UserCircle
                          aria-hidden="true"
                          className="size-4 shrink-0 text-[#6366F1]"
                        />
                        <span className="truncate">
                          {session.user.name ?? session.user.email ?? (
                            <LocalizedText k="common.profile" />
                          )}
                        </span>
                      </p>
                    </div>
                    <SignOutButton className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 text-sm font-semibold text-[#0F172A] shadow-sm transition duration-200 hover:bg-[#F8FAFC]">
                      <LocalizedText k="common.exit" />
                    </SignOutButton>
                  </div>
                </div>
              ) : null}
            </header>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
