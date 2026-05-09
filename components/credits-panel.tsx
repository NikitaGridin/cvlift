"use client";

import {
  Coins,
  WalletCards,
} from "lucide-react";
import {
  ANALYSIS_CREDIT_COST,
  CREDIT_NAME,
  formatUsdCents,
  type CreditPackage,
  type WalletSummary,
} from "@/lib/credits-public";
import { useI18n } from "@/components/preferences-provider";

type CreditsPanelProps = {
  initialSummary: WalletSummary;
  packages: CreditPackage[];
};

export function CreditsPanel({
  initialSummary,
  packages,
}: CreditsPanelProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <section className="rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#6366F1]">{CREDIT_NAME}</p>
            <h2 className="mt-2 text-5xl font-bold tracking-tight text-[#0F172A]">
              {initialSummary.balance}
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
              {t("credits.perAnalysis", { count: ANALYSIS_CREDIT_COST })}
            </p>
          </div>
          <span className="flex size-12 items-center justify-center rounded-[20px] bg-[#6366F1]/10 text-[#6366F1]">
            <WalletCards aria-hidden="true" className="size-6" />
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-[22px] bg-[#FAFBFC] p-4">
            <p className="text-sm font-bold text-[#0F172A]">
              {t("credits.added", { count: initialSummary.lifetimeCredits })}
            </p>
            <p className="mt-1 text-sm font-medium text-[#64748B]">
              {t("credits.addedText")}
            </p>
          </div>
          <div className="rounded-[22px] bg-[#FAFBFC] p-4">
            <p className="text-sm font-bold text-[#0F172A]">
              {t("credits.spent", { count: initialSummary.spentCredits })}
            </p>
            <p className="mt-1 text-sm font-medium text-[#64748B]">
              {t("credits.spentText")}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold text-[#6366F1]">{t("credits.packagesEyebrow")}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">
              {t("credits.topUpTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B]">
              {t("credits.topUpText")}
            </p>
          </div>
          <span className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-black/[0.06] bg-[#FAFBFC] px-4 text-sm font-bold text-[#0F172A]">
            <Coins aria-hidden="true" className="size-4 text-[#6366F1]" />
            {t("credits.mockBadge")}
          </span>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-3">
          {packages.map((item) => (
            <article
              key={item.id}
              className={`relative rounded-[24px] border p-5 ${
                item.badge
                  ? "border-[#6366F1]/40 bg-white shadow-[0_16px_42px_rgba(99,102,241,0.12)]"
                  : "border-black/[0.06] bg-[#FAFBFC]"
              }`}
            >
              {item.badge ? (
                <span className="absolute right-4 top-4 rounded-full bg-[#6366F1] px-3 py-1 text-xs font-bold text-white">
                  {getPackageBadge(item, t)}
                </span>
              ) : null}
              <p className="text-sm font-bold text-[#64748B]">{getPackageName(item, t)}</p>
              <p className="mt-3 text-3xl font-bold text-[#0F172A]">
                {item.credits}
              </p>
              <p className="mt-1 text-sm font-bold text-[#6366F1]">
                {formatUsdCents(item.amountUsdCents)}
              </p>
              <p className="mt-4 text-sm font-medium leading-6 text-[#64748B]">
                {getPackageDescription(item, t)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl xl:col-span-2">
        <div className="flex items-start gap-4 rounded-[24px] bg-[#FAFBFC] p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[18px] bg-[#6366F1]/10 text-[#6366F1]">
            <Coins aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              {t("credits.usage")}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#64748B]">
              {t("credits.usageText")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function getPackageName(item: CreditPackage, t: ReturnType<typeof useI18n>["t"]) {
  switch (item.id) {
    case "starter":
      return t("credits.packages.starter.name");
    case "focused":
      return t("credits.packages.focused.name");
    case "career":
      return t("credits.packages.career.name");
    default:
      return item.name;
  }
}

function getPackageDescription(item: CreditPackage, t: ReturnType<typeof useI18n>["t"]) {
  switch (item.id) {
    case "starter":
      return t("credits.packages.starter.description");
    case "focused":
      return t("credits.packages.focused.description");
    case "career":
      return t("credits.packages.career.description");
    default:
      return item.description;
  }
}

function getPackageBadge(item: CreditPackage, t: ReturnType<typeof useI18n>["t"]) {
  if (item.id === "focused") {
    return t("credits.packages.focused.badge");
  }

  return item.badge;
}
