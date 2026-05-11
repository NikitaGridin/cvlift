import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { LocalizedText } from "@/components/localized-text";
import { TechnicalInterviewTrainer } from "@/components/technical-interview-trainer";
import { requireUserSession } from "@/lib/auth-required";
import { getWalletSummary } from "@/lib/credits";
import { getUnlockedTrainerTestReferences } from "@/lib/trainer-test-credits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Технический тренажер",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TrainerPage() {
  const session = await requireUserSession();
  const wallet = await getWalletSummary(session.user.id);
  const unlockedTestReferences = await getUnlockedTrainerTestReferences(
    session.user.id,
  );

  return (
    <AppShell
      title={<LocalizedText k="trainer.title" />}
      subtitle={<LocalizedText k="trainer.subtitle" />}
    >
      <TechnicalInterviewTrainer
        initialCreditsBalance={wallet.balance}
        initialUnlockedTestReferences={unlockedTestReferences}
      />
    </AppShell>
  );
}
