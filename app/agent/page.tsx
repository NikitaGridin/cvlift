import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { LocalizedText } from "@/components/localized-text";
import { ResumeAgentChat } from "@/components/resume-agent-chat";
import { requireUserSession } from "@/lib/auth-required";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Создание резюме",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AgentPage() {
  await requireUserSession();

  return (
    <AppShell
      hideHeader
      title={<LocalizedText k="agent.title" />}
      subtitle={<LocalizedText k="agent.subtitle" />}
    >
      <ResumeAgentChat />
    </AppShell>
  );
}
