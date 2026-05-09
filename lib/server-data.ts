import { auth } from "@/auth";
import type { AnalysisRecord, ResumeAnalysis } from "@/lib/analysis-types";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function getSessionSafely() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

export async function getAnalysisRecord(id: string) {
  const session = await getSessionSafely();

  if (!session?.user?.id || !isDatabaseConfigured()) {
    return null;
  }

  try {
    const analysis = await prisma.analysis.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: { resume: true },
    });

    if (!analysis) {
      return null;
    }

    return toRecord({
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
    });
  } catch {
    return null;
  }
}

export async function getHistoryRecords() {
  const session = await getSessionSafely();

  if (!session?.user?.id || !isDatabaseConfigured()) {
    return [];
  }

  try {
    const analyses = await prisma.analysis.findMany({
      where: { userId: session.user.id },
      include: { resume: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return analyses.map((analysis) =>
      toRecord({
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
    );
  } catch {
    return [];
  }
}

function toRecord(input: {
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
