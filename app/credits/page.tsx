import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { CreditsPanel } from "@/components/credits-panel";
import { LocalizedText } from "@/components/localized-text";
import { requireUserSession } from "@/lib/auth-required";
import { getCreditsPageData } from "@/lib/credits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Credits",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CreditsPage() {
  const session = await requireUserSession();
  const data = await getCreditsPageData(session.user.id);

  return (
    <AppShell
      title={<LocalizedText k="credits.title" />}
      subtitle={<LocalizedText k="credits.subtitle" />}
    >
      <CreditsPanel
        initialSummary={data.summary}
        packages={data.packages}
      />
    </AppShell>
  );
}
