import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { LocalizedText } from "@/components/localized-text";
import { ResumeAnalyzer } from "@/components/resume-analyzer";
import { requireUserSession } from "@/lib/auth-required";
import { getWalletSummary } from "@/lib/credits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upload Resume",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UploadPage() {
  const session = await requireUserSession();
  const wallet = await getWalletSummary(session.user.id);

  return (
    <AppShell
      title={<LocalizedText k="upload.title" />}
      subtitle={<LocalizedText k="upload.subtitle" />}
    >
      <ResumeAnalyzer creditsBalance={wallet.balance} />
    </AppShell>
  );
}
