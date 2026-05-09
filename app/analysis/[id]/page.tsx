import type { Metadata } from "next";
import { AnalysisView } from "@/components/analysis-view";
import { AppShell } from "@/components/app-shell";
import { LocalizedText } from "@/components/localized-text";
import { requireUserSession } from "@/lib/auth-required";
import { getAnalysisRecord } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resume Analysis",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUserSession();
  const { id } = await params;
  const record = await getAnalysisRecord(id);

  return (
    <AppShell
      title={<LocalizedText k="analysis.title" />}
      subtitle={<LocalizedText k="analysis.subtitle" />}
    >
      <AnalysisView initialRecord={record} />
    </AppShell>
  );
}
