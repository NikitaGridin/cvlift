"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  DollarSign,
  FileText,
  Loader2,
  ScanSearch,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type SetStateAction } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import type { AnalysisRecord } from "@/lib/analysis-types";
import { useAnalysisStore } from "@/lib/analysis-store";
import { ANALYSIS_CREDIT_COST } from "@/lib/credits-public";
import { useI18n } from "@/components/preferences-provider";
import type { TranslationKey } from "@/lib/i18n";
import { defaultItRole, popularItRoles } from "@/lib/it-roles";

function createFormSchema(t: (key: TranslationKey) => string) {
  return z.object({
    analysisMode: z.enum(["vacancy", "general"]),
    targetRole: z
      .string()
      .trim()
      .min(2, { message: t("resume.error.roleRequired") })
      .max(100),
    salaryMin: z
      .string()
      .trim()
      .optional()
      .refine(isValidSalaryInput, { message: t("resume.error.salaryInvalid") }),
    salaryMax: z
      .string()
      .trim()
      .optional()
      .refine(isValidSalaryInput, { message: t("resume.error.salaryInvalid") }),
    salaryCurrency: z.enum(["USD", "EUR", "RUB"]),
    resume: z.any(),
    vacancyText: z.string().max(16_000).optional(),
  })
  .refine(
    (value) =>
      value.analysisMode === "general" ||
      Boolean(value.vacancyText?.trim()),
    {
      message: t("resume.error.vacancyRequired"),
      path: ["vacancyText"],
    },
  )
  .refine(
    (value) => {
      const min = salaryToNumber(value.salaryMin);
      const max = salaryToNumber(value.salaryMax);
      return typeof min !== "number" || typeof max !== "number" || max >= min;
    },
    {
      message: t("resume.error.salaryInvalid"),
      path: ["salaryMax"],
    },
  );
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;
type LoadingStep = {
  title: string;
  detail: string;
  short: string;
};

export function ResumeAnalyzer({
  compact = false,
  creditsBalance,
}: {
  compact?: boolean;
  creditsBalance?: number;
}) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const setCurrent = useAnalysisStore((state) => state.setCurrent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const formSchema = useMemo(() => createFormSchema(t), [t]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      analysisMode: "vacancy",
      targetRole: defaultItRole,
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "USD",
      vacancyText: "",
    },
  });
  const analysisMode = useWatch({
    control,
    name: "analysisMode",
  });
  const loadingSteps = useMemo(
    () => getLoadingSteps(analysisMode ?? "vacancy", t),
    [analysisMode, t],
  );
  const activeLoadingStep = loadingSteps[Math.min(loadingStepIndex, loadingSteps.length - 1)];
  const hasCredits =
    typeof creditsBalance !== "number" || creditsBalance >= ANALYSIS_CREDIT_COST;

  useEffect(() => {
    if (!showProgressModal) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [showProgressModal]);

  useEffect(() => {
    if (!showProgressModal) {
      return;
    }

    const startedAt = Date.now();
    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setAnalysisProgress((current) => getRealisticProgress(current, elapsed));
    }, 240);

    const phraseTimer = window.setInterval(() => {
      setLoadingStepIndex((current) => {
        return Math.min(current + 1, loadingSteps.length - 1);
      });
    }, 2200);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(phraseTimer);
    };
  }, [loadingSteps.length, showProgressModal]);

  const fileLabel = useMemo(() => {
    if (!selectedFile) {
      return t("resume.file.empty");
    }

    return `${selectedFile.name} - ${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`;
  }, [selectedFile, t]);

  async function submit(values: FormValues) {
    setApiError(null);
    const file = selectedFile ?? getFileFromInput(values.resume);

    if (!file) {
      setApiError(t("resume.error.uploadFirst"));
      return;
    }

    if (!hasCredits) {
      setApiError(t("resume.error.noCredits"));
      return;
    }

    const payload = new FormData();
    payload.append("resume", file);
    payload.append("analysisMode", values.analysisMode);
    payload.append("targetRole", values.targetRole);
    payload.append("salaryMin", values.salaryMin ?? "");
    payload.append("salaryMax", values.salaryMax ?? "");
    payload.append("salaryCurrency", values.salaryCurrency);
    payload.append("vacancyText", values.vacancyText ?? "");

    setAnalysisProgress(1);
    setLoadingStepIndex(0);
    setShowProgressModal(true);

    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json()) as { record?: AnalysisRecord; error?: string };

      if (response.status === 401) {
        setShowProgressModal(false);
        setApiError(t("resume.error.sessionExpired"));
        return;
      }

      if (!response.ok || !data.record) {
        setShowProgressModal(false);
        setApiError(localizeAnalysisError(data.error, t));
        return;
      }

      setLoadingStepIndex(loadingSteps.length - 1);
      await completeProgress(setAnalysisProgress);
      setCurrent(data.record);
      router.push(`/analysis/${data.record.id}`);
    } catch {
      setShowProgressModal(false);
      setApiError(t("resume.error.unavailable"));
    }
  }

  return (
    <form id="resume-analyzer-form" onSubmit={handleSubmit(submit)} className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`rounded-[24px] border border-black/[0.06] bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7 ${
          compact ? "" : "lg:p-8"
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              {t("resume.upload.title")}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#64748B]">
              {t("resume.upload.subtitle")}
            </p>
          </div>
        </div>

        <label
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) {
              setSelectedFile(file);
              setValue("resume", event.dataTransfer.files, { shouldValidate: true });
            }
          }}
          className={`group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed p-8 text-center transition duration-200 ${
            isDragging
              ? "border-[#6366F1] bg-[#6366F1]/8 shadow-[0_0_0_6px_rgba(99,102,241,0.08)]"
              : "border-black/10 bg-[#FAFBFC] hover:border-[#6366F1]/70 hover:bg-white hover:shadow-[0_18px_50px_rgba(99,102,241,0.12)]"
          }`}
        >
          <input
            {...register("resume")}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
            }}
          />
          <span className="flex size-16 items-center justify-center rounded-[22px] bg-white text-[#6366F1] shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-200 group-hover:scale-105">
            <UploadCloud aria-hidden="true" className="size-7" />
          </span>
          <span className="mt-5 text-lg font-bold text-[#0F172A]">{fileLabel}</span>
          <span className="mt-2 max-w-sm text-sm font-medium leading-6 text-[#64748B]">
            {t("resume.upload.drop")}
          </span>
        </label>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03, duration: 0.45 }}
        className="rounded-[24px] border border-black/[0.06] bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7"
      >
        <div className="mb-5 flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[18px] bg-[#6366F1]/10 text-[#6366F1]">
            <BriefcaseBusiness aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
              {t("resume.target.title")}
            </h2>
            <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
              {t("resume.target.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#0F172A]">
              {t("resume.target.role")}
            </span>
            <select
              {...register("targetRole")}
              className="h-14 w-full rounded-full border border-black/[0.06] bg-[#FAFBFC] px-5 text-sm font-semibold text-[#0F172A] outline-none transition duration-200 focus:border-[#6366F1]/50 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10"
            >
              {popularItRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label[locale]}
                </option>
              ))}
            </select>
            {errors.targetRole ? (
              <p className="mt-2 text-sm font-semibold text-[#EF4444]">
                {errors.targetRole.message}
              </p>
            ) : null}
          </label>

          <div>
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
              <DollarSign aria-hidden="true" className="size-4 text-[#6366F1]" />
              {t("analysis.target.salary")}
            </span>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_104px]">
              <input
                {...register("salaryMin")}
                inputMode="numeric"
                placeholder={t("resume.target.salaryFrom")}
                className="h-14 w-full rounded-full border border-black/[0.06] bg-[#FAFBFC] px-5 text-sm font-semibold text-[#0F172A] outline-none transition duration-200 placeholder:text-[#94A3B8] focus:border-[#6366F1]/50 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10"
              />
              <input
                {...register("salaryMax")}
                inputMode="numeric"
                placeholder={t("resume.target.salaryTo")}
                className="h-14 w-full rounded-full border border-black/[0.06] bg-[#FAFBFC] px-5 text-sm font-semibold text-[#0F172A] outline-none transition duration-200 placeholder:text-[#94A3B8] focus:border-[#6366F1]/50 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10"
              />
              <select
                {...register("salaryCurrency")}
                aria-label={t("resume.target.currency")}
                className="h-14 w-full rounded-full border border-black/[0.06] bg-[#FAFBFC] px-4 text-sm font-bold text-[#0F172A] outline-none transition duration-200 focus:border-[#6366F1]/50 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
              </select>
            </div>
            {errors.salaryMin || errors.salaryMax ? (
              <p className="mt-2 text-sm font-semibold text-[#EF4444]">
                {errors.salaryMin?.message ?? errors.salaryMax?.message}
              </p>
            ) : (
              <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
                {t("resume.target.help")}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02, duration: 0.45 }}
        className={`flex flex-col justify-between gap-4 rounded-[24px] border p-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center ${
          hasCredits
            ? "border-black/[0.06] bg-white/75"
            : "border-[#F59E0B]/20 bg-[#F59E0B]/8"
        }`}
      >
        <div>
          <p className="text-sm font-bold text-[#0F172A]">
            {t("resume.credits.available", { count: creditsBalance ?? 0 })}
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
            {t("resume.credits.cost", { count: ANALYSIS_CREDIT_COST })}
          </p>
        </div>
        <Link
          href="/credits"
          className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-[#6366F1] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(99,102,241,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#4F46E5]"
        >
          {t("resume.credits.topUp")}
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.45 }}
        className="rounded-[24px] border border-black/[0.06] bg-white/75 p-4 shadow-sm backdrop-blur-xl"
      >
        <input type="hidden" {...register("analysisMode")} />
        <div className="grid gap-3 rounded-[20px] bg-[#FAFBFC] p-2 sm:grid-cols-2">
          {[
            {
              value: "vacancy",
              title: t("resume.mode.vacancy.title"),
              text: t("resume.mode.vacancy.text"),
            },
            {
              value: "general",
              title: t("resume.mode.general.title"),
              text: t("resume.mode.general.text"),
            },
          ].map((item) => {
            const active = analysisMode === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setValue("analysisMode", item.value as FormValues["analysisMode"], {
                    shouldValidate: true,
                  });

                  if (item.value === "general") {
                    setValue("vacancyText", "", { shouldValidate: true });
                  }
                }}
                className={`rounded-[18px] px-4 py-4 text-left transition duration-200 ${
                  active
                    ? "bg-white text-[#0F172A] shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                    : "text-[#64748B] hover:bg-white/60"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <ScanSearch
                    aria-hidden="true"
                    className={`size-4 ${active ? "text-[#6366F1]" : "text-[#94A3B8]"}`}
                  />
                  {item.title}
                </span>
                <span className="mt-1 block text-sm font-medium leading-6">
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
        className="grid gap-5"
      >
        {analysisMode === "vacancy" ? (
          <div className="rounded-[24px] border border-black/[0.06] bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                  <FileText aria-hidden="true" className="size-4 text-[#6366F1]" />
                  {t("resume.vacancyText")}
                </label>
                <textarea
                  {...register("vacancyText")}
                  rows={compact ? 6 : 10}
                  placeholder={t("resume.vacancyPlaceholder")}
                  className="min-h-44 w-full resize-none rounded-[22px] border border-black/[0.06] bg-[#FAFBFC] px-4 py-4 text-sm font-medium leading-6 text-[#0F172A] outline-none transition duration-200 placeholder:text-[#94A3B8] focus:border-[#6366F1]/50 focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10"
                />
                {errors.vacancyText ? (
                  <p className="mt-2 text-sm font-semibold text-[#EF4444]">
                    {errors.vacancyText.message}
                  </p>
                ) : null}
              </div>

              <div className="rounded-[22px] border border-black/[0.06] bg-[#FAFBFC] p-4">
                <p className="text-sm font-bold text-[#0F172A]">{t("resume.whatYouGet")}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">
                  {t("resume.whatYouGetText")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-black/[0.06] bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-7">
            <div className="flex items-start gap-4 rounded-[22px] bg-[#FAFBFC] p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[18px] bg-[#6366F1]/10 text-[#6366F1]">
                <ScanSearch aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {t("resume.general.title")}
                </h3>
                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#64748B]">
                  {t("resume.general.text")}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {apiError ? (
        <div className="flex items-start gap-3 rounded-[20px] border border-[#EF4444]/15 bg-[#EF4444]/8 px-4 py-3 text-sm font-semibold text-[#B91C1C]">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {apiError}
        </div>
      ) : null}

      <div className="hidden justify-end sm:flex">
        <button
          type="submit"
          disabled={isSubmitting || !hasCredits}
          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#6366F1] px-7 text-sm font-bold text-white shadow-[0_16px_40px_rgba(99,102,241,0.26)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
          {t("common.analyzeResume")}
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.06] bg-white/85 p-4 backdrop-blur-xl sm:hidden">
        <button
          type="submit"
          disabled={isSubmitting || !hasCredits}
          className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#6366F1] px-7 text-sm font-bold text-white shadow-[0_16px_40px_rgba(99,102,241,0.26)] transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
          {t("common.analyzeResume")}
        </button>
      </div>

      <AnimatePresence>
        {showProgressModal ? (
          <AnalysisProgressModal
            progress={analysisProgress}
            step={activeLoadingStep}
            steps={loadingSteps}
            title={t("resume.progress.title")}
            text={t("resume.progress.text")}
          />
        ) : null}
      </AnimatePresence>
    </form>
  );
}

function AnalysisProgressModal({
  progress,
  step,
  steps,
  title,
  text,
}: {
  progress: number;
  step: LoadingStep;
  steps: LoadingStep[];
  title: string;
  text: string;
}) {
  const roundedProgress = Math.round(progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/20 px-4 py-8 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analysis-progress-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-lg overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_34px_110px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
      >
        <div className="relative p-6 sm:p-7">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full bg-[#6366F1]/12 blur-3xl" />
          <div className="relative flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-[22px] bg-[#6366F1] text-white shadow-[0_18px_42px_rgba(99,102,241,0.3)]">
                <Sparkles aria-hidden="true" className="size-6" />
                <span className="absolute inset-0 rounded-[22px] ring-8 ring-[#6366F1]/10" />
              </span>
              <div>
                <h2 id="analysis-progress-title" className="text-2xl font-bold tracking-tight text-[#0F172A]">
                  {title}
                </h2>
                <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
                  {text}
                </p>
              </div>
            </div>
            <div className="rounded-full border border-black/[0.06] bg-white px-3 py-1 text-sm font-bold text-[#6366F1] shadow-sm">
              {roundedProgress}%
            </div>
          </div>

          <div className="relative mt-7">
            <div className="h-3 overflow-hidden rounded-full bg-[#EEF2F7]">
              <motion.div
                className="h-full rounded-full bg-[#6366F1] shadow-[0_0_24px_rgba(99,102,241,0.45)]"
                initial={{ width: 0 }}
                animate={{ width: `${roundedProgress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 rounded-[22px] border border-black/[0.06] bg-[#FAFBFC] p-4"
              aria-live="polite"
            >
              <p className="text-base font-bold text-[#0F172A]">{step.title}</p>
              <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
                {step.detail}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {steps.map((item, index) => {
              const done = index < steps.findIndex((candidate) => candidate.title === step.title);
              const active = item.title === step.title;

              return (
                <div
                  key={item.title}
                  className={`flex min-w-0 items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold transition duration-200 ${
                    active
                      ? "bg-[#6366F1]/10 text-[#4F46E5]"
                      : done
                        ? "bg-[#22C55E]/10 text-[#15803D]"
                        : "bg-white text-[#94A3B8]"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
                  ) : (
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        active ? "bg-[#6366F1]" : "bg-[#CBD5E1]"
                      }`}
                    />
                  )}
                  <span className="truncate">{item.short}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getLoadingSteps(
  mode: FormValues["analysisMode"],
  t: (key: TranslationKey) => string,
): LoadingStep[] {
  return [
    {
      title: t("resume.loading.upload.title"),
      detail: t("resume.loading.upload.detail"),
      short: t("resume.loading.upload.short"),
    },
    {
      title: t("resume.loading.read.title"),
      detail: t("resume.loading.read.detail"),
      short: t("resume.loading.read.short"),
    },
    mode === "vacancy"
      ? {
          title: t("resume.loading.match.title"),
          detail: t("resume.loading.match.detail"),
          short: t("resume.loading.match.short"),
        }
      : {
          title: t("resume.loading.positioning.title"),
          detail: t("resume.loading.positioning.detail"),
          short: t("resume.loading.positioning.short"),
        },
    {
      title: t("resume.loading.keywords.title"),
      detail: t("resume.loading.keywords.detail"),
      short: t("resume.loading.keywords.short"),
    },
    {
      title: t("resume.loading.score.title"),
      detail: t("resume.loading.score.detail"),
      short: t("resume.loading.score.short"),
    },
    {
      title: t("resume.loading.improve.title"),
      detail: t("resume.loading.improve.detail"),
      short: t("resume.loading.improve.short"),
    },
    {
      title: t("resume.loading.finish.title"),
      detail: t("resume.loading.finish.detail"),
      short: t("resume.loading.finish.short"),
    },
  ];
}

function getRealisticProgress(current: number, elapsedMs: number) {
  const elapsed = elapsedMs / 1000;
  let target = 2;

  if (elapsed < 3) {
    target = 2 + easeInOutSine(elapsed / 3) * 14;
  } else if (elapsed < 12) {
    target = 16 + easeOutQuad((elapsed - 3) / 9) * 44;
  } else if (elapsed < 30) {
    target = 60 + easeInOutSine((elapsed - 12) / 18) * 32;
  } else {
    target = 92 + (1 - Math.exp(-(elapsed - 30) / 18)) * 6.4;
  }

  const easing = elapsed < 3 ? 0.12 : elapsed < 30 ? 0.18 : 0.1;
  const next = current + (target - current) * easing;

  if (elapsed < 30) {
    return Math.max(current, Math.min(92, next));
  }

  return Math.max(current, Math.min(98.8, next));
}

function completeProgress(setProgress: (value: SetStateAction<number>) => void) {
  const duration = 950;
  const startedAt = performance.now();

  return new Promise<void>((resolve) => {
    function tick(now: number) {
      const ratio = clamp01((now - startedAt) / duration);
      const eased = easeOutCubic(ratio);

      setProgress((current) => {
        const gain = (100 - current) * Math.max(0.1, eased * 0.32);
        return Math.max(current, Math.min(99.8, current + gain));
      });

      if (ratio < 1) {
        window.requestAnimationFrame(tick);
        return;
      }

      setProgress(100);
      window.setTimeout(resolve, 180);
    }

    window.requestAnimationFrame(tick);
  });
}

function easeOutCubic(value: number) {
  const clamped = clamp01(value);
  return 1 - (1 - clamped) ** 3;
}

function easeOutQuad(value: number) {
  const clamped = clamp01(value);
  return 1 - (1 - clamped) * (1 - clamped);
}

function easeInOutSine(value: number) {
  const clamped = clamp01(value);
  return -(Math.cos(Math.PI * clamped) - 1) / 2;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function isValidSalaryInput(value: string | undefined) {
  return value === undefined || value === "" || typeof salaryToNumber(value) === "number";
}

function salaryToNumber(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/[^\d]/g, "");
  return normalized ? Number(normalized) : undefined;
}

function localizeAnalysisError(
  error: string | undefined,
  t: (key: TranslationKey) => string,
) {
  if (!error) {
    return t("resume.error.unavailable");
  }

  const messages: Record<string, TranslationKey> = {
    "Add vacancy text.": "resume.error.vacancyRequired",
    "Choose a target IT role.": "resume.error.roleRequired",
    "Enter a valid salary range.": "resume.error.salaryInvalid",
    "Salary max must be greater than salary min.": "resume.error.salaryInvalid",
    "Not enough CV Credits to analyze a resume.": "resume.error.noCredits",
  };

  return messages[error] ? t(messages[error]) : error;
}

function getFileFromInput(value: unknown) {
  if (typeof FileList !== "undefined" && value instanceof FileList) {
    return value[0] ?? null;
  }

  if (Array.isArray(value) && value[0] instanceof File) {
    return value[0];
  }

  return null;
}
