import type { ResumeAnalysis } from "@/lib/analysis-types";
import type { AnalysisMode } from "@/lib/analysis-types";
import {
  resumeAnalysisJsonSchema,
  resumeAnalysisSchema,
} from "@/lib/analysis-schema";
import { hasRealEnv } from "@/lib/env";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? "openai/gpt-5.2";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
    error?: {
      message?: string;
    };
  }>;
  error?: {
    message?: string;
  };
  model?: string;
};

export async function analyzeResumeWithOpenRouter(params: {
  analysisMode: AnalysisMode;
  resumeText: string;
  targetRole: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  vacancyText?: string;
  userId?: string;
}): Promise<{ analysis: ResumeAnalysis; model: string; source: "openrouter" }> {
  if (!hasRealEnv("OPENROUTER_API_KEY")) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? process.env.AUTH_URL ?? "http://localhost:3000",
      "X-OpenRouter-Title": "OfferLyra",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(params.analysisMode),
        },
        {
          role: "user",
          content: buildUserPrompt(params),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "resume_analysis",
          strict: true,
          schema: resumeAnalysisJsonSchema,
        },
      },
      max_tokens: 9500,
      temperature: 0.35,
      user: params.userId,
    }),
  });

  const data = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `OpenRouter request failed with ${response.status}.`,
    );
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      data.choices?.[0]?.error?.message ??
        "OpenRouter returned an empty analysis response.",
    );
  }

  const parsed = resumeAnalysisSchema.safeParse(JSON.parse(content));

  if (!parsed.success) {
    throw new Error("OpenRouter response did not match the resume analysis schema.");
  }

  return {
    analysis: parsed.data,
    model: data.model ?? DEFAULT_MODEL,
    source: "openrouter",
  };
}

function buildSystemPrompt(analysisMode: AnalysisMode) {
  const rewriteMandate = [
    "The improvedResumeText must be a major rewrite, not light proofreading.",
    "Make the resume as strong as credibly possible for the exact target role and salary range.",
    "Make the resume sound premium, senior, specific, and commercially strong while preserving factual honesty.",
    "Rewrite weak bullets into achievement-driven bullets using action, scope, tooling, and result.",
    "Add missing but credible resume ideas as resumeIdeas: projects, metrics, leadership signals, system scale, business impact, tooling depth, certifications, or portfolio evidence the user can truthfully add.",
    "You may aggressively infer stronger framing from the provided experience, but do not present unverifiable employers, degrees, certifications, job titles, dates, or exact factual claims as real.",
    "When a metric would make the resume stronger but the source resume does not provide it, insert a clear editable placeholder such as [X%], [N users], [$X revenue], [Y hours/week], [N-person team], or [X ms] inside the improved resume.",
    "Every editable metric or detail that needs user confirmation must be wrapped in square brackets so it can be visually highlighted for the user.",
    "Use those placeholders freely where they materially improve impact, so the user can replace them with verified numbers.",
    "Audit ATS/search keywords strictly. Return keywordScore and keywordCoverage with matched keywords, missing keywords, recommended keywords, and concrete searchRankingActions.",
    "Add missing ATS keywords naturally when they match the user's likely experience and target role.",
    "If the salary range is ambitious, score more strictly and require stronger evidence of scope, ownership, complexity, business impact, and seniority.",
    "Use the coverLetter field as an interview preparation brief, not as a job application letter: write a concise self-presentation, likely recruiter questions, likely technical questions, and strong answer angles. Keep the same factual constraints.",
  ];

  if (analysisMode === "general") {
    return [
      "You are a senior recruiter, resume strategist, ATS optimization expert, and interview preparation coach.",
      "Analyze the resume without a specific vacancy.",
      "Score overall interview readiness, ATS quality, achievements, structure, clarity, seniority signal, and role positioning.",
      "For vacancyMatchScore, return a role-positioning score: how clearly the resume communicates a target role and market fit without a job description.",
      ...rewriteMandate,
      "Return only JSON matching the schema. Be direct, specific, and actionable.",
    ].join(" ");
  }

  return [
    "You are a senior recruiter, ATS optimization expert, and interview preparation coach.",
    "Analyze the resume against the vacancy.",
    "For vacancyMatchScore, score fit to the provided vacancy.",
    ...rewriteMandate,
    "Return only JSON matching the schema. Be direct, specific, and actionable.",
  ].join(" ");
}

function buildUserPrompt(params: {
  analysisMode: AnalysisMode;
  resumeText: string;
  targetRole: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  vacancyText?: string;
}) {
  const targetContext = [
    `Target role: ${params.targetRole}`,
    `Salary range: ${formatSalaryRange(params)}`,
    "Evaluation rules:",
    "Assess whether this resume is strong enough for the target role and salary range, not just generally good.",
    "Recommend keywords that improve ATS/search ranking for this target.",
    "Suggest credible ideas the user can add to the resume, including example bullets with bracketed placeholders where proof is needed.",
    "Prepare likely HR, behavioral, and technical interview questions based on the resume and role. Put the interview plan into the coverLetter field.",
  ].join("\n");

  if (params.analysisMode === "general") {
    return [
      `Resume:\n${params.resumeText}`,
      targetContext,
      "Analysis mode:",
      "General resume audit without a pasted vacancy, but with the target role and salary range above.",
      "Rewrite target:",
      "Create the strongest credible resume version possible for the target role and salary range. Preserve the user's actual background, but improve positioning, structure, seniority signal, ATS phrasing, keyword coverage, and achievement bullets. Add bracketed metric placeholders wherever the original resume lacks numbers.",
      "Interview preparation target:",
      "In the coverLetter field, produce a practical interview brief in Russian: 30-second self-presentation, 5 likely HR questions, 5 likely technical or role-specific questions, and recommended answer angles.",
    ].join("\n\n");
  }

  return [
    `Resume:\n${params.resumeText}`,
    targetContext,
    `Vacancy:\n${params.vacancyText}`,
    "Rewrite target:",
    "Create the strongest credible resume version possible for this vacancy, target role, and salary range. Reorder and rewrite content around the target job, mirror relevant keywords naturally, and add bracketed metric placeholders wherever quantified impact is missing.",
    "Interview preparation target:",
    "In the coverLetter field, produce a practical interview brief in Russian: 30-second self-presentation, 5 likely HR questions, 5 likely technical or role-specific questions, and recommended answer angles based on this vacancy.",
  ].join("\n\n");
}

function formatSalaryRange(params: {
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
}) {
  const currency = params.salaryCurrency ?? "USD";

  if (params.salaryMin && params.salaryMax) {
    return `${params.salaryMin}-${params.salaryMax} ${currency}`;
  }

  if (params.salaryMin) {
    return `from ${params.salaryMin} ${currency}`;
  }

  if (params.salaryMax) {
    return `up to ${params.salaryMax} ${currency}`;
  }

  return "not specified";
}
