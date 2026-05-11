"use client";

import { useActionState } from "react";
import { CreditCard, Loader2, WalletCards } from "lucide-react";
import {
  createYooKassaTopUp,
  type CreateTopUpState,
} from "@/app/credits/actions";
import {
  ANALYSIS_CREDIT_COST,
  CREDIT_NAME,
  formatRubles,
  type CreditPackage,
  type WalletSummary,
} from "@/lib/credits-public";
import { useI18n } from "@/components/preferences-provider";

type CreditsPanelProps = {
  analysisCreditCost?: number;
  initialSummary: WalletSummary;
  packages: CreditPackage[];
  paymentStatus?: "succeeded" | "pending" | "canceled" | "error";
};

const initialTopUpState: CreateTopUpState = {};

export function CreditsPanel({
  analysisCreditCost = ANALYSIS_CREDIT_COST,
  initialSummary,
  packages,
  paymentStatus,
}: CreditsPanelProps) {
  const { t } = useI18n();
  const [topUpState, topUpAction, isTopUpPending] = useActionState(
    createYooKassaTopUp,
    initialTopUpState,
  );
  const isFreeAnalysis = analysisCreditCost === 0;

  return (
    <div className="grid gap-6 xl:h-[calc(100vh-64px)] xl:grid-cols-[0.72fr_1.28fr]">
      <section className="flex min-h-0 flex-col rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl xl:h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#6366F1]">{CREDIT_NAME}</p>
            <h2 className="mt-2 text-5xl font-bold tracking-tight text-[#0F172A]">
              {isFreeAnalysis ? t("credits.freeLabel") : initialSummary.balance}
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
              {isFreeAnalysis
                ? t("credits.freeMode")
                : t("credits.perAnalysis", { count: analysisCreditCost })}
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

      <section className="min-h-0 overflow-y-auto rounded-[28px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl xl:h-full">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold text-[#6366F1]">
              {t("credits.packagesEyebrow")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">
              {t("credits.topUpTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B]">
              {t("credits.topUpText")}
            </p>
          </div>
          <span className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-black/[0.06] bg-[#FAFBFC] px-4 text-sm font-bold text-[#0F172A]">
            <CreditCard aria-hidden="true" className="size-4 text-[#6366F1]" />
            YooKassa
          </span>
        </div>

        {paymentStatus ? (
          <p className={getPaymentNoticeClass(paymentStatus)}>
            {getPaymentNotice(paymentStatus, t)}
          </p>
        ) : null}

        {topUpState.error ? (
          <p className="mt-5 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {topUpState.error}
          </p>
        ) : null}

        <div className="mt-7 grid gap-3 lg:grid-cols-3">
          {packages.map((item) => (
            <article
              key={item.id}
              className={`relative rounded-[24px] border p-5 flex flex-col justify-between ${
                item.badge
                  ? "border-[#6366F1]/40 bg-white shadow-[0_16px_42px_rgba(99,102,241,0.12)]"
                  : "border-black/[0.06] bg-[#FAFBFC]"
              }`}
            >
              <div>
                {item.badge ? (
                  <span className="absolute right-4 top-4 rounded-full bg-[#6366F1] px-3 py-1 text-xs font-bold text-white">
                    {getPackageBadge(item, t)}
                  </span>
                ) : null}
                <p className="text-sm font-bold text-[#64748B]">
                  {getPackageName(item, t)}
                </p>
                <p className="mt-3 text-3xl font-bold text-[#0F172A]">
                  {item.credits}
                </p>
                <p className="mt-1 text-sm font-bold text-[#6366F1]">
                  {formatRubles(item.amountRubles)}
                </p>
                <p className="mt-4 text-sm font-medium leading-6 text-[#64748B]">
                  {getPackageDescription(item, t)}
                </p>
              </div>
              <form action={topUpAction} className="mt-5">
                <input type="hidden" name="packageId" value={item.id} />
                <button
                  type="submit"
                  disabled={isTopUpPending}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[16px] bg-[#0F172A] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1E293B] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isTopUpPending ? (
                    <Loader2
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                  ) : (
                    <CreditCard aria-hidden="true" className="size-4" />
                  )}
                  {isTopUpPending ? t("credits.payPending") : t("credits.pay")}
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function getPackageName(
  item: CreditPackage,
  t: ReturnType<typeof useI18n>["t"],
) {
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

function getPackageDescription(
  item: CreditPackage,
  t: ReturnType<typeof useI18n>["t"],
) {
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

function getPackageBadge(
  item: CreditPackage,
  t: ReturnType<typeof useI18n>["t"],
) {
  if (item.id === "focused") {
    return t("credits.packages.focused.badge");
  }

  return item.badge;
}

function getPaymentNotice(
  status: NonNullable<CreditsPanelProps["paymentStatus"]>,
  t: ReturnType<typeof useI18n>["t"],
) {
  switch (status) {
    case "succeeded":
      return t("credits.payment.succeeded");
    case "pending":
      return t("credits.payment.pending");
    case "canceled":
      return t("credits.payment.canceled");
    case "error":
      return t("credits.payment.error");
  }
}

function getPaymentNoticeClass(
  status: NonNullable<CreditsPanelProps["paymentStatus"]>,
) {
  const tone =
    status === "succeeded"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-red-200 bg-red-50 text-red-700";

  return `mt-5 rounded-[18px] border px-4 py-3 text-sm font-bold ${tone}`;
}
