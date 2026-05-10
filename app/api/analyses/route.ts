import { analyzeRequestSchema } from "@/lib/analysis-schema";
import type { AnalysisRecord, ResumeAnalysis } from "@/lib/analysis-types";
import {
  InsufficientCreditsError,
  getAnalysisCreditCost,
  getWalletSummary,
  spendAnalysisCredit,
} from "@/lib/credits";
import { analyzeResumeWithOpenRouter } from "@/lib/openrouter-analysis";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { parseResumeFile, resolveVacancyInput } from "@/lib/resume-parser";
import { getSessionSafely } from "@/lib/server-data";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const session = await getSessionSafely();

  if (!session?.user?.id || !isDatabaseConfigured()) {
    return Response.json({ analyses: [] });
  }

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    include: { resume: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return Response.json({
    analyses: analyses.map((analysis) =>
      toAnalysisRecord({
        id: analysis.id,
        fileName: analysis.resume?.fileName ?? "Resume",
        analysisMode: analysis.analysisMode as AnalysisRecord["analysisMode"],
        targetRole: analysis.targetRole,
        salaryMin: analysis.salaryMin,
        salaryMax: analysis.salaryMax,
        salaryCurrency: analysis.salaryCurrency,
        vacancyText: analysis.vacancyText,
        resumeText: analysis.resume?.originalText ?? "",
        createdAt: analysis.createdAt.toISOString(),
        analysis: {
          totalScore: analysis.totalScore,
          atsScore: analysis.atsScore,
          vacancyMatchScore: analysis.vacancyMatchScore,
          keywordScore: analysis.keywordScore,
          weakPoints: analysis.weakPoints,
          strongPoints: analysis.strongPoints,
          recommendedFixes: analysis.recommendedFixes,
          keywordCoverage: analysis.keywordCoverage,
          resumeIdeas: analysis.resumeIdeas,
          improvedResumeText: analysis.improvedResumeText,
          coverLetter: analysis.coverLetter,
        },
      }),
    ),
  });
}

export async function POST(request: Request) {
  const session = await getSessionSafely();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Войдите через Google перед анализом резюме." },
      { status: 401 },
    );
  }

  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: "Токены временно недоступны. Попробуйте позже." },
      { status: 503 },
    );
  }

  const analysisCreditCost = getAnalysisCreditCost();

  if (analysisCreditCost > 0) {
    const wallet = await getWalletSummary(session.user.id);

    if (wallet.balance < analysisCreditCost) {
      return Response.json(
        { error: "Недостаточно токенов для проверки резюме." },
        { status: 402 },
      );
    }
  }

  const formData = await request.formData();
  const file = formData.get("resume");

  if (!(file instanceof File)) {
    return Response.json({ error: "Upload a PDF, DOCX, or TXT resume." }, { status: 400 });
  }

  const fields = analyzeRequestSchema.safeParse({
    analysisMode: formData.get("analysisMode"),
    vacancyText: formData.get("vacancyText"),
    targetRole: formData.get("targetRole"),
    salaryMin: formData.get("salaryMin"),
    salaryMax: formData.get("salaryMax"),
    salaryCurrency: formData.get("salaryCurrency"),
  });

  if (!fields.success) {
    return Response.json(
      { error: getInvalidRequestMessage(fields.error.issues) },
      { status: 400 },
    );
  }

  try {
    const resumeText = await parseResumeFile(file);
    const analysisMode = fields.data.analysisMode;
    const vacancyText =
      analysisMode === "vacancy"
        ? await resolveVacancyInput(fields.data.vacancyText)
        : null;

    const result = await analyzeResumeWithOpenRouter({
      analysisMode,
      resumeText,
      targetRole: fields.data.targetRole,
      salaryMin: fields.data.salaryMin,
      salaryMax: fields.data.salaryMax,
      salaryCurrency: fields.data.salaryCurrency,
      vacancyText: vacancyText ?? undefined,
      userId: session.user.id,
    });

    const baseRecord: AnalysisRecord = {
      id: `local-${Date.now()}`,
      fileName: file.name,
      analysisMode,
      targetRole: fields.data.targetRole,
      salaryMin: fields.data.salaryMin ?? null,
      salaryMax: fields.data.salaryMax ?? null,
      salaryCurrency: fields.data.salaryCurrency,
      vacancyText,
      resumeText,
      createdAt: new Date().toISOString(),
      source: result.source,
      analysis: result.analysis,
    };

    const saved = await prisma.$transaction(async (tx) => {
      const resume = await tx.resume.create({
        data: {
          userId: session.user.id,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          originalText: resumeText,
        },
      });

      const analysis = await tx.analysis.create({
        data: {
          userId: session.user.id,
          resumeId: resume.id,
          analysisMode,
          targetRole: fields.data.targetRole,
          salaryMin: fields.data.salaryMin,
          salaryMax: fields.data.salaryMax,
          salaryCurrency: fields.data.salaryCurrency,
          vacancyText,
          totalScore: result.analysis.totalScore,
          atsScore: result.analysis.atsScore,
          vacancyMatchScore: result.analysis.vacancyMatchScore,
          keywordScore: result.analysis.keywordScore,
          weakPoints: result.analysis.weakPoints,
          strongPoints: result.analysis.strongPoints,
          recommendedFixes: result.analysis.recommendedFixes,
          keywordCoverage: result.analysis.keywordCoverage,
          resumeIdeas: result.analysis.resumeIdeas,
          improvedResumeText: result.analysis.improvedResumeText,
          coverLetter: result.analysis.coverLetter,
          model: result.model,
        },
      });

      await spendAnalysisCredit(tx, session.user.id, analysis.id, analysisCreditCost);

      return { resume, analysis };
    });

    baseRecord.id = saved.analysis.id;
    baseRecord.createdAt = saved.analysis.createdAt.toISOString();
    baseRecord.source = result.source;

    return Response.json({ record: baseRecord });
  } catch (error) {
    return Response.json(
      { error: getClientErrorMessage(error) },
      { status: error instanceof InsufficientCreditsError ? error.status : 500 },
    );
  }
}

function toAnalysisRecord(input: {
  id: string;
  fileName: string;
  analysisMode?: AnalysisRecord["analysisMode"];
  targetRole?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  vacancyText?: string | null;
  resumeText: string;
  createdAt: string;
  analysis: {
    totalScore: number;
    atsScore: number;
    vacancyMatchScore: number;
    keywordScore?: number | null;
    weakPoints: unknown;
    strongPoints: unknown;
    recommendedFixes: unknown;
    keywordCoverage?: unknown;
    resumeIdeas?: unknown;
    improvedResumeText: string;
    coverLetter: string;
  };
}): AnalysisRecord {
  return {
    id: input.id,
    fileName: input.fileName,
    analysisMode: input.analysisMode ?? "vacancy",
    targetRole: input.targetRole,
    salaryMin: input.salaryMin,
    salaryMax: input.salaryMax,
    salaryCurrency: input.salaryCurrency,
    vacancyText: input.vacancyText,
    resumeText: input.resumeText,
    createdAt: input.createdAt,
    source: "database",
    analysis: {
      totalScore: input.analysis.totalScore,
      atsScore: input.analysis.atsScore,
      vacancyMatchScore: input.analysis.vacancyMatchScore,
      keywordScore:
        typeof input.analysis.keywordScore === "number"
          ? input.analysis.keywordScore
          : input.analysis.atsScore,
      weakPoints: asStringArray(input.analysis.weakPoints),
      strongPoints: asStringArray(input.analysis.strongPoints),
      recommendedFixes: Array.isArray(input.analysis.recommendedFixes)
        ? (input.analysis.recommendedFixes as ResumeAnalysis["recommendedFixes"])
        : [],
      keywordCoverage: asKeywordCoverage(input.analysis.keywordCoverage),
      resumeIdeas: asResumeIdeas(input.analysis.resumeIdeas),
      improvedResumeText: input.analysis.improvedResumeText,
      coverLetter: input.analysis.coverLetter,
    },
  };
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function asKeywordCoverage(value: unknown): ResumeAnalysis["keywordCoverage"] {
  if (!isRecord(value)) {
    return {
      matchedKeywords: [],
      missingKeywords: [],
      recommendedKeywords: [],
      searchRankingActions: [],
    };
  }

  return {
    matchedKeywords: asStringArray(value.matchedKeywords),
    missingKeywords: asStringArray(value.missingKeywords),
    recommendedKeywords: asStringArray(value.recommendedKeywords),
    searchRankingActions: asStringArray(value.searchRankingActions),
  };
}

function asResumeIdeas(value: unknown): ResumeAnalysis["resumeIdeas"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .map((item) => ({
      title: typeof item.title === "string" ? item.title : "",
      whyItHelps: typeof item.whyItHelps === "string" ? item.whyItHelps : "",
      exampleBullet: typeof item.exampleBullet === "string" ? item.exampleBullet : "",
      priority: asPriority(item.priority),
    }))
    .filter((item) => item.title && item.whyItHelps && item.exampleBullet);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asPriority(value: unknown): "high" | "medium" | "low" {
  return value === "high" || value === "medium" || value === "low" ? value : "medium";
}

function getClientErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const userFacingMessages = [
    "Неподдерживаемый тип файла. Загрузите PDF, DOCX или TXT.",
    "Добавьте текст вакансии.",
    "Выберите целевую IT-должность.",
    "Введите корректную зарплатную вилку.",
    "Недостаточно токенов для проверки резюме.",
  ];

  if (userFacingMessages.includes(message)) {
    return message;
  }

  return "Анализ резюме временно недоступен. Попробуйте позже.";
}

function getInvalidRequestMessage(
  issues: Array<{ path: PropertyKey[]; message: string }>,
) {
  const hasSalaryIssue = issues.some((issue) =>
    issue.path.some((part) => part === "salaryMin" || part === "salaryMax"),
  );

  if (hasSalaryIssue) {
    return "Введите корректную зарплатную вилку.";
  }

  const hasRoleIssue = issues.some((issue) =>
    issue.path.some((part) => part === "targetRole"),
  );

  if (hasRoleIssue) {
    return "Выберите целевую IT-должность.";
  }

  return "Добавьте текст вакансии.";
}
