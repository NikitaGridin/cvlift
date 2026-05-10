import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LocalizedText } from "@/components/localized-text";
import { ScoreRing } from "@/components/score-ring";
import { requireUserSession } from "@/lib/auth-required";
import { getHistoryRecords } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analysis History",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HistoryPage() {
  await requireUserSession();
  const records = await getHistoryRecords();

  return (
    <AppShell
      title={<LocalizedText k="history.title" />}
      subtitle={<LocalizedText k="history.subtitle" />}
    >
      {records.length ? (
        <div className="grid gap-4">
          {records.map((record) => (
            <Link
              key={record.id}
              href={`/analysis/${record.id}`}
              className="grid gap-5 rounded-[24px] border border-black/[0.06] bg-white/75 p-5 shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:grid-cols-[auto_1fr_auto] sm:items-center"
            >
              <ScoreRing score={record.analysis.totalScore} size="sm" />
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#64748B]">
                  <Clock3 aria-hidden="true" className="size-4" />
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(record.createdAt))}
                </div>
                <h2 className="text-xl font-bold text-[#0F172A]">{record.fileName}</h2>
                <p className="mt-2 line-clamp-2 max-w-3xl text-sm font-medium leading-6 text-[#64748B]">
                  {record.analysis.weakPoints[0]}
                </p>
              </div>
              <span className="inline-flex size-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#0F172A]">
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-black/[0.06] bg-white/75 p-8 shadow-sm backdrop-blur-xl">
          <p className="text-sm font-semibold text-[#6366F1]">
            <LocalizedText k="history.empty.eyebrow" />
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">
            <LocalizedText k="history.empty.title" />
          </h2>
          <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#64748B]">
            <LocalizedText k="history.empty.text" />
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#6366F1] px-5 text-sm font-bold text-white transition duration-200 hover:bg-[#4F46E5]"
          >
            <LocalizedText k="common.startAnalysis" />
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      )}
    </AppShell>
  );
}
