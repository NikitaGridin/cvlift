import { z } from "zod";

export const recommendedFixSchema = z.object({
  category: z.enum([
    "experience",
    "stack",
    "achievements",
    "ats",
    "structure",
    "vacancyMatch",
    "keywords",
    "compensation",
    "positioning",
  ]),
  title: z.string().min(2),
  currentIssue: z.string().min(2),
  suggestedFix: z.string().min(2),
  impact: z.enum(["high", "medium", "low"]),
});

export const keywordCoverageSchema = z.object({
  matchedKeywords: z.array(z.string().min(1)),
  missingKeywords: z.array(z.string().min(1)),
  recommendedKeywords: z.array(z.string().min(1)),
  searchRankingActions: z.array(z.string().min(2)),
});

export const resumeIdeaSchema = z.object({
  title: z.string().min(2),
  whyItHelps: z.string().min(2),
  exampleBullet: z.string().min(10),
  priority: z.enum(["high", "medium", "low"]),
});

export const resumeAnalysisSchema = z.object({
  totalScore: z.number().int().min(0).max(100),
  atsScore: z.number().int().min(0).max(100),
  vacancyMatchScore: z.number().int().min(0).max(100),
  keywordScore: z.number().int().min(0).max(100),
  weakPoints: z.array(z.string().min(2)).min(1),
  strongPoints: z.array(z.string().min(2)).min(1),
  recommendedFixes: z.array(recommendedFixSchema).min(1),
  keywordCoverage: keywordCoverageSchema,
  resumeIdeas: z.array(resumeIdeaSchema).min(1),
  improvedResumeText: z.string().min(20),
  coverLetter: z.string().min(20),
});

export const analyzeRequestSchema = z.object({
  analysisMode: z.preprocess(
    (value) => (value === "general" ? "general" : "vacancy"),
    z.enum(["vacancy", "general"]),
  ),
  vacancyText: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.string().trim().optional(),
  ),
  targetRole: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().trim().min(2).max(100),
  ),
  salaryMin: z.preprocess(parseOptionalSalary, z.number().int().positive().optional()),
  salaryMax: z.preprocess(parseOptionalSalary, z.number().int().positive().optional()),
  salaryCurrency: z.preprocess(
    (value) => (value === "EUR" || value === "RUB" ? value : "USD"),
    z.enum(["USD", "EUR", "RUB"]),
  ),
}).refine(
  (value) =>
    value.analysisMode === "general" ||
    Boolean(value.vacancyText?.trim()),
  {
    message: "Add vacancy text.",
    path: ["vacancyText"],
  },
).refine(
  (value) =>
    typeof value.salaryMin !== "number" ||
    typeof value.salaryMax !== "number" ||
    value.salaryMax >= value.salaryMin,
  {
    message: "Salary max must be greater than salary min.",
    path: ["salaryMax"],
  },
);

export const resumeAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "totalScore",
    "atsScore",
    "vacancyMatchScore",
    "keywordScore",
    "weakPoints",
    "strongPoints",
    "recommendedFixes",
    "keywordCoverage",
    "resumeIdeas",
    "improvedResumeText",
    "coverLetter",
  ],
  properties: {
    totalScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    atsScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    vacancyMatchScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    keywordScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    weakPoints: {
      type: "array",
      minItems: 1,
      items: { type: "string" },
    },
    strongPoints: {
      type: "array",
      minItems: 1,
      items: { type: "string" },
    },
    recommendedFixes: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "category",
          "title",
          "currentIssue",
          "suggestedFix",
          "impact",
        ],
        properties: {
          category: {
            type: "string",
            enum: [
              "experience",
              "stack",
              "achievements",
              "ats",
              "structure",
              "vacancyMatch",
              "keywords",
              "compensation",
              "positioning",
            ],
          },
          title: { type: "string" },
          currentIssue: { type: "string" },
          suggestedFix: { type: "string" },
          impact: {
            type: "string",
            enum: ["high", "medium", "low"],
          },
        },
      },
    },
    keywordCoverage: {
      type: "object",
      additionalProperties: false,
      required: [
        "matchedKeywords",
        "missingKeywords",
        "recommendedKeywords",
        "searchRankingActions",
      ],
      properties: {
        matchedKeywords: {
          type: "array",
          items: { type: "string" },
        },
        missingKeywords: {
          type: "array",
          items: { type: "string" },
        },
        recommendedKeywords: {
          type: "array",
          items: { type: "string" },
        },
        searchRankingActions: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
    resumeIdeas: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "whyItHelps", "exampleBullet", "priority"],
        properties: {
          title: { type: "string" },
          whyItHelps: { type: "string" },
          exampleBullet: { type: "string" },
          priority: {
            type: "string",
            enum: ["high", "medium", "low"],
          },
        },
      },
    },
    improvedResumeText: { type: "string" },
    coverLetter: { type: "string" },
  },
} as const;

function parseOptionalSalary(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^\d]/g, "");
    return normalized ? Number(normalized) : Number.NaN;
  }

  return value;
}
