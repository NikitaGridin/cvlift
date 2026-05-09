"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Copy,
  FileText,
  Gauge,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AnalysisRecord } from "@/lib/analysis-types";
import type { ResumeFixCategory } from "@/lib/analysis-types";
import { useAnalysisStore } from "@/lib/analysis-store";
import { ProgressMeter } from "@/components/progress-meter";
import { useI18n } from "@/components/preferences-provider";
import { ResumeFillInText } from "@/components/resume-fill-in-text";
import { ScoreRing } from "@/components/score-ring";
import type { TranslationKey } from "@/lib/i18n";

type AnalysisViewProps = {
  initialRecord?: AnalysisRecord | null;
};

const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const fixCategoryKeys: Record<ResumeFixCategory, TranslationKey> = {
  experience: "analysis.fixCategory.experience",
  stack: "analysis.fixCategory.stack",
  achievements: "analysis.fixCategory.achievements",
  ats: "analysis.fixCategory.ats",
  structure: "analysis.fixCategory.structure",
  vacancyMatch: "analysis.fixCategory.vacancyMatch",
  keywords: "analysis.fixCategory.keywords",
  compensation: "analysis.fixCategory.compensation",
  positioning: "analysis.fixCategory.positioning",
};

export function AnalysisView({ initialRecord }: AnalysisViewProps) {
  const { t } = useI18n();
  const current = useAnalysisStore((state) => state.current);
  const setCurrent = useAnalysisStore((state) => state.setCurrent);
  const record = initialRecord ?? current;
  const isGeneralMode = record?.analysisMode === "general";
  const keywordScore =
    record?.analysis.keywordScore ??
    record?.analysis.atsScore ??
    record?.analysis.totalScore ??
    0;
  const keywordCoverage = record?.analysis.keywordCoverage ?? {
    matchedKeywords: [],
    missingKeywords: [],
    recommendedKeywords: [],
    searchRankingActions: [],
  };
  const resumeIdeas = record?.analysis.resumeIdeas ?? [];
  const [activeText, setActiveText] = useState<
    "improved" | "original" | "cover"
  >("improved");

  useEffect(() => {
    if (initialRecord) {
      setCurrent(initialRecord);
    }
  }, [initialRecord, setCurrent]);

  const structureScore = useMemo(() => {
    if (!record) {
      return 0;
    }

    return Math.max(
      48,
      Math.min(
        98,
        Math.round((record.analysis.atsScore + record.analysis.totalScore) / 2),
      ),
    );
  }, [record]);

  const scoreCards = useMemo(() => {
    if (!record) {
      return [];
    }

    return [
      {
        label: "ATS",
        value: record.analysis.atsScore,
        caption: t("analysis.score.ats.caption"),
      },
      {
        label: isGeneralMode
          ? t("analysis.score.positioning")
          : t("analysis.score.match"),
        value: record.analysis.vacancyMatchScore,
        caption: isGeneralMode
          ? t("analysis.score.positioning.caption")
          : t("analysis.score.match.caption"),
      },
      {
        label: t("analysis.score.keywords"),
        value: keywordScore,
        caption: t("analysis.score.keywords.caption"),
      },
      {
        label: t("analysis.score.structure"),
        value: structureScore,
        caption: t("analysis.score.structure.caption"),
      },
    ];
  }, [isGeneralMode, keywordScore, record, structureScore, t]);

  const activeTextConfig = {
    improved: {
      title: t("analysis.docs.improvedTitle"),
      text: record?.analysis.improvedResumeText ?? "",
      tone: "green" as const,
    },
    original: {
      title: t("analysis.docs.originalTitle"),
      text: formatOriginalResumeText(record?.resumeText ?? ""),
      tone: "neutral" as const,
    },
    cover: {
      title: t("analysis.docs.coverTitle"),
      text: record?.analysis.coverLetter ?? "",
      tone: "purple" as const,
    },
  }[activeText];

  if (!record) {
    return (
      <div className="rounded-[24px] border border-black/[0.06] bg-white/75 p-8 text-center shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-[22px] bg-[#6366F1]/10 text-[#6366F1]">
          <FileText aria-hidden="true" className="size-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-[#0F172A]">
          {t("analysis.empty.title")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">
          {t("analysis.empty.text")}
        </p>
        <Link href="/upload" className="cvlift-primary-button mt-6">
          {t("analysis.empty.cta")}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-5 overflow-hidden">
      <motion.section
        {...cardAnimation}
        transition={{ duration: 0.45 }}
        className="max-w-full overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:p-5 lg:p-6"
      >
        <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] 2xl:items-center">
          <div className="flex min-w-0 flex-col gap-4 rounded-[24px] bg-[#FAFBFC] p-4 sm:flex-row sm:items-center">
            <div className="shrink-0">
              <ScoreRing score={record.analysis.totalScore} size="sm" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#6366F1]">
                {isGeneralMode
                  ? t("analysis.mode.general")
                  : t("analysis.mode.vacancy")}
              </p>
              <h2 className="mt-2 truncate text-2xl font-bold tracking-tight text-[#0F172A]">
                {record.fileName}
              </h2>
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B]">
                {record.analysis.weakPoints[0]}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <TargetPill
                  label={t("analysis.target.role")}
                  value={record.targetRole}
                />
                <TargetPill
                  label={t("analysis.target.salary")}
                  value={formatSalaryRange(record)}
                />
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
            {scoreCards.map((score) => (
              <ScoreStat
                key={score.label}
                label={score.label}
                value={score.value}
                caption={score.caption}
              />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        {...cardAnimation}
        transition={{ delay: 0.08, duration: 0.45 }}
        className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]"
      >
        <div className="min-w-0 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#6366F1]">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {t("analysis.fixes.title")}
                </h2>
                <p className="text-sm font-medium text-[#64748B]">
                  {t("analysis.fixes.text")}
                </p>
              </div>
            </div>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#6366F1]">
              <Gauge aria-hidden="true" className="size-5" />
            </span>
          </div>

          <div className="grid gap-3">
            {record.analysis.recommendedFixes.map((fix, index) => (
              <motion.div
                key={`${fix.title}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                className="grid min-w-0 gap-3 rounded-[22px] border border-black/[0.06] bg-[#FAFBFC] p-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
              >
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#6366F1]/10 px-3 py-1 text-xs font-bold text-[#4F46E5]">
                      {t(fixCategoryKeys[fix.category])}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-[#64748B]">
                      {t("analysis.impact", {
                        impact: t(
                          `analysis.priority.${fix.impact}` as TranslationKey,
                        ),
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    {fix.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
                    {fix.currentIssue}
                  </p>
                </div>
                <p className="min-w-0 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#0F172A]">
                  {fix.suggestedFix}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <div className="rounded-[24px] border border-black/[0.06] bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:p-5">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#6366F1]">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {isGeneralMode
                    ? t("analysis.match.title.general")
                    : t("analysis.match.title.vacancy")}
                </h2>
                <p className="text-sm font-medium text-[#64748B]">
                  {isGeneralMode
                    ? t("analysis.match.text.general")
                    : t("analysis.match.text.vacancy")}
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <ProgressMeter
                label={t("analysis.progress.ats")}
                value={record.analysis.atsScore}
              />
              <ProgressMeter
                label={
                  isGeneralMode
                    ? t("analysis.progress.positioning")
                    : t("analysis.score.match")
                }
                value={record.analysis.vacancyMatchScore}
              />
              <ProgressMeter
                label={t("analysis.progress.keywords")}
                value={keywordScore}
              />
              <ProgressMeter
                label={t("analysis.progress.structure")}
                value={structureScore}
              />
              <ProgressMeter
                label={t("analysis.progress.readability")}
                value={Math.max(52, record.analysis.totalScore - 4)}
              />
            </div>
          </div>

          <div className="grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-1">
            <InsightList
              title={t("analysis.weakPoints")}
              icon={<CircleAlert aria-hidden="true" className="size-4" />}
              tone="warning"
              items={record.analysis.weakPoints}
            />
            <InsightList
              title={t("analysis.strengths")}
              icon={<CheckCircle2 aria-hidden="true" className="size-4" />}
              tone="success"
              items={record.analysis.strongPoints}
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        {...cardAnimation}
        transition={{ delay: 0.12, duration: 0.45 }}
        className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        <KeywordCoverageCard
          score={keywordScore}
          coverage={keywordCoverage}
          title={t("analysis.keywords.title")}
          text={t("analysis.keywords.text")}
          matchedLabel={t("analysis.keywords.matched")}
          missingLabel={t("analysis.keywords.missing")}
          recommendedLabel={t("analysis.keywords.recommended")}
          actionsLabel={t("analysis.keywords.actions")}
          emptyText={t("analysis.keywords.empty")}
        />
        <ResumeIdeasCard
          ideas={resumeIdeas}
          title={t("analysis.ideas.title")}
          text={t("analysis.ideas.text")}
          emptyText={t("analysis.ideas.empty")}
          whyLabel={t("analysis.ideas.why")}
          exampleLabel={t("analysis.ideas.example")}
          priorityLabel={(priority) =>
            t(`analysis.priority.${priority}` as TranslationKey)
          }
        />
      </motion.section>

      <motion.section
        {...cardAnimation}
        transition={{ delay: 0.16, duration: 0.45 }}
        className="max-w-full overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:p-5"
      >
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              {t("analysis.docs.title")}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#64748B]">
              {t("analysis.docs.text")}
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {[
              ["improved", t("analysis.docs.improved")],
              ["original", t("analysis.docs.original")],
              ["cover", t("analysis.docs.cover")],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveText(key as typeof activeText)}
                className={`h-10 rounded-full px-3 text-sm font-bold transition duration-200 sm:px-4 ${
                  activeText === key
                    ? "bg-[#6366F1] text-white shadow-[0_12px_28px_rgba(99,102,241,0.24)]"
                    : "border border-black/[0.06] bg-white text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(activeTextConfig.text)
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 text-sm font-bold text-[#0F172A] transition duration-200 hover:bg-[#FAFBFC] sm:px-4"
            >
              <Copy aria-hidden="true" className="size-4" />
              {t("common.copy")}
            </button>
          </div>
        </div>

        <TextPanel
          title={activeTextConfig.title}
          tone={activeTextConfig.tone}
          text={activeTextConfig.text}
          highlightFillIns={activeText === "improved"}
          fillInText={t("analysis.docs.fillIns")}
        />
      </motion.section>
    </div>
  );
}

function TargetPill({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1 text-xs font-bold text-[#64748B]">
      <span className="text-[#6366F1]">{label}:</span>
      <span className="truncate text-[#0F172A]">{value}</span>
    </span>
  );
}

function KeywordCoverageCard({
  score,
  coverage,
  title,
  text,
  matchedLabel,
  missingLabel,
  recommendedLabel,
  actionsLabel,
  emptyText,
}: {
  score: number;
  coverage: AnalysisRecord["analysis"]["keywordCoverage"];
  title: string;
  text: string;
  matchedLabel: string;
  missingLabel: string;
  recommendedLabel: string;
  actionsLabel: string;
  emptyText: string;
}) {
  const hasData = [
    coverage.matchedKeywords,
    coverage.missingKeywords,
    coverage.recommendedKeywords,
    coverage.searchRankingActions,
  ].some((items) => items.length > 0);

  return (
    <div className="min-w-0 rounded-[24px] border border-black/[0.06] bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#6366F1]">
            <Gauge aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">{title}</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
              {text}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#6366F1]/10 px-3 py-1 text-sm font-bold text-[#4F46E5]">
          {score}/100
        </span>
      </div>

      {hasData ? (
        <div className="grid gap-3">
          <KeywordList
            label={matchedLabel}
            items={coverage.matchedKeywords}
            tone="success"
          />
          <KeywordList
            label={missingLabel}
            items={coverage.missingKeywords}
            tone="warning"
          />
          <KeywordList
            label={recommendedLabel}
            items={coverage.recommendedKeywords}
            tone="primary"
          />
          <KeywordList
            label={actionsLabel}
            items={coverage.searchRankingActions}
            tone="neutral"
          />
        </div>
      ) : (
        <p className="rounded-[20px] bg-[#FAFBFC] p-4 text-sm font-medium leading-6 text-[#64748B]">
          {emptyText}
        </p>
      )}
    </div>
  );
}

function KeywordList({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "success" | "warning" | "primary" | "neutral";
}) {
  const toneClass = {
    success: "bg-[#22C55E]/10 text-[#15803D]",
    warning: "bg-[#F59E0B]/10 text-[#B45309]",
    primary: "bg-[#6366F1]/10 text-[#4F46E5]",
    neutral: "bg-white text-[#64748B]",
  }[tone];

  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-[20px] bg-[#FAFBFC] p-4">
      <p className="mb-3 text-sm font-bold text-[#0F172A]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`max-w-full rounded-full px-3 py-1 text-xs font-bold ${toneClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ResumeIdeasCard({
  ideas,
  title,
  text,
  emptyText,
  whyLabel,
  exampleLabel,
  priorityLabel,
}: {
  ideas: AnalysisRecord["analysis"]["resumeIdeas"];
  title: string;
  text: string;
  emptyText: string;
  whyLabel: string;
  exampleLabel: string;
  priorityLabel: (priority: "high" | "medium" | "low") => string;
}) {
  return (
    <div className="min-w-0 rounded-[24px] border border-black/[0.06] bg-white/75 p-4 shadow-sm backdrop-blur-xl sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#22C55E]/10 text-[#15803D]">
          <Sparkles aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">{title}</h2>
          <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
            {text}
          </p>
        </div>
      </div>

      {ideas.length ? (
        <div className="grid gap-3">
          {ideas.map((idea, index) => (
            <article
              key={`${idea.title}-${index}`}
              className="rounded-[20px] border border-black/[0.06] bg-[#FAFBFC] p-4"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-bold text-[#15803D]">
                  {priorityLabel(idea.priority)}
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">
                  {idea.title}
                </h3>
              </div>
              <p className="text-sm font-semibold text-[#0F172A]">{whyLabel}</p>
              <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
                {idea.whyItHelps}
              </p>
              <p className="mt-4 text-sm font-semibold text-[#0F172A]">
                {exampleLabel}
              </p>
              <p className="mt-1 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#0F172A]">
                {idea.exampleBullet}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-[20px] bg-[#FAFBFC] p-4 text-sm font-medium leading-6 text-[#64748B]">
          {emptyText}
        </p>
      )}
    </div>
  );
}

function ScoreStat({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  const color =
    value >= 80
      ? "text-[#15803D]"
      : value >= 60
        ? "text-[#B45309]"
        : "text-[#B91C1C]";

  return (
    <div className="min-w-0 rounded-[22px] border border-black/[0.06] bg-[#FAFBFC] p-4">
      <p className="text-sm font-bold text-[#64748B]">{label}</p>
      <div className="mt-3 flex items-end gap-1">
        <span className={`text-3xl font-bold tracking-tight ${color}`}>
          {value}
        </span>
        <span className="pb-1 text-sm font-bold text-[#94A3B8]">/100</span>
      </div>
      <p className="mt-2 text-xs font-semibold leading-5 text-[#64748B]">
        {caption}
      </p>
    </div>
  );
}

function InsightList({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: "warning" | "success";
}) {
  const classes =
    tone === "success"
      ? "bg-[#22C55E]/10 text-[#15803D]"
      : "bg-[#F59E0B]/10 text-[#B45309]";

  return (
    <div className="min-w-0 rounded-[24px] border border-black/[0.06] bg-white/75 p-4">
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`flex size-8 items-center justify-center rounded-full ${classes}`}
        >
          {icon}
        </span>
        <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="break-words text-sm font-medium leading-6 text-[#64748B]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TextPanel({
  title,
  text,
  tone,
  fillInText,
  highlightFillIns = false,
}: {
  title: string;
  text: string;
  tone: "red" | "green" | "purple" | "neutral";
  fillInText: string;
  highlightFillIns?: boolean;
}) {
  const toneClass = {
    green: "border-[#22C55E]/20 bg-[#22C55E]/5",
    red: "border-[#EF4444]/15 bg-[#EF4444]/5",
    purple: "border-[#6366F1]/15 bg-[#6366F1]/5",
    neutral: "border-black/[0.06] bg-[#FAFBFC]",
  }[tone];

  return (
    <div
      className={`min-w-0 max-w-full overflow-hidden rounded-[22px] border p-4 ${toneClass}`}
    >
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[#64748B]">
        {title}
      </h3>
      {highlightFillIns ? (
        <p className="mb-4 rounded-2xl border border-[#EF4444]/15 bg-white/70 px-4 py-3 text-sm font-semibold leading-6 text-[#B91C1C]">
          {fillInText}
        </p>
      ) : null}
      <pre className="max-h-[58vh] min-h-72 max-w-full overflow-auto whitespace-pre-wrap break-words font-sans text-sm font-medium leading-7 text-[#0F172A]">
        <ResumeFillInText text={text} highlight={highlightFillIns} />
      </pre>
    </div>
  );
}

function formatOriginalResumeText(text: string) {
  const normalized = text
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if ((normalized.match(/\n/g) ?? []).length >= 4) {
    return normalized;
  }

  const headingPattern =
    /\s+(PROFESSIONAL SUMMARY|Professional Summary|SUMMARY|Summary|PROFILE|Profile|OBJECTIVE|Objective|WORK EXPERIENCE|Work Experience|EXPERIENCE|Experience|EMPLOYMENT|Employment|PROJECTS|Projects|SKILLS|Skills|TECHNICAL SKILLS|Technical Skills|TECH STACK|Tech Stack|EDUCATION|Education|CERTIFICATIONS|Certifications|CERTIFICATES|Certificates|AWARDS|Awards|LANGUAGES|Languages)(?=\s|:)/g;

  return normalized
    .replace(headingPattern, "\n\n$1\n")
    .replace(/\s+([•▪●○])\s+/g, "\n$1 ")
    .replace(/\s+-\s+(?=[A-ZА-Я0-9])/g, "\n- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatSalaryRange(record: AnalysisRecord) {
  const currency = record.salaryCurrency ?? "";

  if (record.salaryMin && record.salaryMax) {
    return `${formatNumber(record.salaryMin)}-${formatNumber(record.salaryMax)} ${currency}`.trim();
  }

  if (record.salaryMin) {
    return `${formatNumber(record.salaryMin)}+ ${currency}`.trim();
  }

  if (record.salaryMax) {
    return `<= ${formatNumber(record.salaryMax)} ${currency}`.trim();
  }

  return null;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
