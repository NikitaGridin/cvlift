import type { AnalysisRecord, ResumeAnalysis } from "@/lib/analysis-types";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { getSessionSafely } from "@/lib/server-data";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/analyses/[id]">,
) {
  const session = await getSessionSafely();
  const { id } = await context.params;

  if (!session?.user?.id || !isDatabaseConfigured()) {
    return Response.json({ record: null }, { status: 404 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: { resume: true },
  });

  if (!analysis) {
    return Response.json({ record: null }, { status: 404 });
  }

  const record: AnalysisRecord = {
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
    source: "database",
    analysis: {
      totalScore: analysis.totalScore,
      atsScore: analysis.atsScore,
      vacancyMatchScore: analysis.vacancyMatchScore,
      keywordScore: analysis.keywordScore,
      weakPoints: asStringArray(analysis.weakPoints),
      strongPoints: asStringArray(analysis.strongPoints),
      recommendedFixes: Array.isArray(analysis.recommendedFixes)
        ? (analysis.recommendedFixes as ResumeAnalysis["recommendedFixes"])
        : [],
      keywordCoverage: asKeywordCoverage(analysis.keywordCoverage),
      resumeIdeas: asResumeIdeas(analysis.resumeIdeas),
      improvedResumeText: analysis.improvedResumeText,
      coverLetter: analysis.coverLetter,
    },
  };

  return Response.json({ record });
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
