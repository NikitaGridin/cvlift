import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { LocalizedText } from "@/components/localized-text";
import { ResumeAnalyzer } from "@/components/resume-analyzer";
import { requireUserSession } from "@/lib/auth-required";
import { getAnalysisCreditCost, getWalletSummary } from "@/lib/credits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analysis",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UploadPage() {
  const session = await requireUserSession();
  const wallet = await getWalletSummary(session.user.id);
  const analysisCreditCost = getAnalysisCreditCost();

  return (
    <AppShell
      title={<LocalizedText k="upload.title" />}
      subtitle={<LocalizedText k="upload.subtitle" />}
    >
      <ResumeAnalyzer
        analysisCreditCost={analysisCreditCost}
        creditsBalance={wallet.balance}
      />
    </AppShell>
  );
}
