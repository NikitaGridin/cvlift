export type ResumeFixCategory =
  | "experience"
  | "stack"
  | "achievements"
  | "ats"
  | "structure"
  | "vacancyMatch"
  | "keywords"
  | "compensation"
  | "positioning";

export type AnalysisMode = "vacancy" | "general";

export type RecommendedFix = {
  category: ResumeFixCategory;
  title: string;
  currentIssue: string;
  suggestedFix: string;
  impact: "high" | "medium" | "low";
};

export type KeywordCoverage = {
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendedKeywords: string[];
  searchRankingActions: string[];
};

export type ResumeIdea = {
  title: string;
  whyItHelps: string;
  exampleBullet: string;
  priority: "high" | "medium" | "low";
};

export type ResumeAnalysis = {
  totalScore: number;
  atsScore: number;
  vacancyMatchScore: number;
  keywordScore: number;
  weakPoints: string[];
  strongPoints: string[];
  recommendedFixes: RecommendedFix[];
  keywordCoverage: KeywordCoverage;
  resumeIdeas: ResumeIdea[];
  improvedResumeText: string;
  coverLetter: string;
};

export type AnalysisRecord = {
  id: string;
  fileName: string;
  analysisMode: AnalysisMode;
  targetRole?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  vacancyText?: string | null;
  resumeText: string;
  createdAt: string;
  source: "openrouter" | "database";
  analysis: ResumeAnalysis;
};

export const fixCategoryLabels: Record<ResumeFixCategory, string> = {
  experience: "Experience",
  stack: "Stack",
  achievements: "Achievements",
  ats: "ATS",
  structure: "Structure",
  vacancyMatch: "Vacancy match",
  keywords: "Keywords",
  compensation: "Compensation",
  positioning: "Positioning",
};
