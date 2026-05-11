import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { CreditsPanel } from "@/components/credits-panel";
import { LocalizedText } from "@/components/localized-text";
import { requireUserSession } from "@/lib/auth-required";
import { syncCreditPaymentForUser } from "@/lib/credit-payments";
import { getAnalysisCreditCost, getCreditsPageData } from "@/lib/credits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Токены",
  robots: {
    index: false,
    follow: false,
  },
};

type CreditsPageProps = {
  searchParams?: Promise<{
    topUp?: string | string[];
  }>;
};

export default async function CreditsPage({ searchParams }: CreditsPageProps) {
  const session = await requireUserSession();
  const topUpId = getSingleSearchParam((await searchParams)?.topUp);
  const paymentStatus = topUpId
    ? await syncCreditPaymentForUser(session.user.id, topUpId)
    : null;
  const data = await getCreditsPageData(session.user.id);
  const analysisCreditCost = getAnalysisCreditCost();

  return (
    <AppShell
      title={<LocalizedText k="credits.title" />}
      subtitle={<LocalizedText k="credits.subtitle" />}
    >
      <CreditsPanel
        analysisCreditCost={analysisCreditCost}
        initialSummary={data.summary}
        packages={data.packages}
        paymentStatus={paymentStatus ?? undefined}
      />
    </AppShell>
  );
}

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
