import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/analyses/route";

const mocks = vi.hoisted(() => ({
  analyzeResumeWithOpenRouter: vi.fn(),
  getAnalysisCreditCost: vi.fn(),
  getSessionSafely: vi.fn(),
  getWalletSummary: vi.fn(),
  isDatabaseConfigured: vi.fn(),
  parseResumeFile: vi.fn(),
  prismaTransaction: vi.fn(),
  resolveVacancyInput: vi.fn(),
  spendAnalysisCredit: vi.fn(),
}));

vi.mock("@/lib/credits", () => ({
  InsufficientCreditsError: class InsufficientCreditsError extends Error {
    status = 402;

    constructor() {
      super("Недостаточно токенов для проверки резюме.");
      this.name = "InsufficientCreditsError";
    }
  },
  getAnalysisCreditCost: mocks.getAnalysisCreditCost,
  getWalletSummary: mocks.getWalletSummary,
  spendAnalysisCredit: mocks.spendAnalysisCredit,
}));

vi.mock("@/lib/openrouter-analysis", () => ({
  analyzeResumeWithOpenRouter: mocks.analyzeResumeWithOpenRouter,
}));

vi.mock("@/lib/prisma", () => ({
  isDatabaseConfigured: mocks.isDatabaseConfigured,
  prisma: {
    $transaction: mocks.prismaTransaction,
  },
}));

vi.mock("@/lib/resume-parser", () => ({
  parseResumeFile: mocks.parseResumeFile,
  resolveVacancyInput: mocks.resolveVacancyInput,
}));

vi.mock("@/lib/server-data", () => ({
  getSessionSafely: mocks.getSessionSafely,
}));

let tx: ReturnType<typeof createAnalysisTransactionClient>;

beforeEach(() => {
  vi.clearAllMocks();

  tx = createAnalysisTransactionClient();

  mocks.getSessionSafely.mockResolvedValue({
    user: { id: "user-1" },
  });
  mocks.isDatabaseConfigured.mockReturnValue(true);
  mocks.getAnalysisCreditCost.mockReturnValue(1);
  mocks.getWalletSummary.mockResolvedValue({
    balance: 1,
    lifetimeCredits: 1,
    spentCredits: 0,
  });
  mocks.parseResumeFile.mockResolvedValue("Parsed resume text with measurable impact.");
  mocks.resolveVacancyInput.mockImplementation(async (value: string) => value.trim());
  mocks.analyzeResumeWithOpenRouter.mockResolvedValue({
    analysis: analysisFixture,
    model: "test-model",
    source: "openrouter",
  });
  mocks.prismaTransaction.mockImplementation(
    async (callback: (transactionClient: typeof tx) => Promise<unknown>) =>
      callback(tx),
  );
  mocks.spendAnalysisCredit.mockResolvedValue({
    id: "wallet-1",
    balance: 0,
  });
});

describe("POST /api/analyses credit gate", () => {
  test("allows a signed-in user to analyze a resume without wallet balance when free mode is enabled", async () => {
    mocks.getAnalysisCreditCost.mockReturnValue(0);
    mocks.getWalletSummary.mockResolvedValue({
      balance: 0,
      lifetimeCredits: 0,
      spentCredits: 0,
    });

    const response = await POST(createAnalysisRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.getWalletSummary).not.toHaveBeenCalled();
    expect(mocks.parseResumeFile).toHaveBeenCalledOnce();
    expect(mocks.analyzeResumeWithOpenRouter).toHaveBeenCalledWith(
      expect.objectContaining({
        analysisMode: "vacancy",
        resumeText: "Parsed resume text with measurable impact.",
        targetRole: "Frontend Engineer",
        userId: "user-1",
        vacancyText: "React vacancy with TypeScript and measurable delivery.",
      }),
    );
    expect(mocks.spendAnalysisCredit).toHaveBeenCalledWith(
      tx,
      "user-1",
      "analysis-1",
      0,
    );
    expect(tx.resume.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        fileName: "resume.txt",
        fileType: "text/plain",
        originalText: "Parsed resume text with measurable impact.",
      },
    });
    expect(tx.analysis.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        resumeId: "resume-1",
        analysisMode: "vacancy",
        targetRole: "Frontend Engineer",
        vacancyText: "React vacancy with TypeScript and measurable delivery.",
        model: "test-model",
        totalScore: 82,
      }),
    });
    expect(body.record).toMatchObject({
      id: "analysis-1",
      fileName: "resume.txt",
      resumeText: "Parsed resume text with measurable impact.",
      source: "openrouter",
    });
  });

  test("returns 402 before parsing, AI calls, or database writes when paid mode has no credits", async () => {
    mocks.getAnalysisCreditCost.mockReturnValue(1);
    mocks.getWalletSummary.mockResolvedValue({
      balance: 0,
      lifetimeCredits: 0,
      spentCredits: 0,
    });

    const response = await POST(createAnalysisRequest());
    const body = await response.json();

    expect(response.status).toBe(402);
    expect(body).toEqual({
      error: "Недостаточно токенов для проверки резюме.",
    });
    expect(mocks.parseResumeFile).not.toHaveBeenCalled();
    expect(mocks.analyzeResumeWithOpenRouter).not.toHaveBeenCalled();
    expect(mocks.prismaTransaction).not.toHaveBeenCalled();
    expect(mocks.spendAnalysisCredit).not.toHaveBeenCalled();
  });

  test("uses the same paid analysis cost for wallet precheck and transaction spending", async () => {
    mocks.getAnalysisCreditCost.mockReturnValue(2);
    mocks.getWalletSummary.mockResolvedValue({
      balance: 2,
      lifetimeCredits: 2,
      spentCredits: 0,
    });

    const response = await POST(createAnalysisRequest());

    expect(response.status).toBe(200);
    expect(mocks.getWalletSummary).toHaveBeenCalledWith("user-1");
    expect(mocks.spendAnalysisCredit).toHaveBeenCalledWith(
      tx,
      "user-1",
      "analysis-1",
      2,
    );
  });

  test("does not check credits or touch the database when the user is signed out", async () => {
    mocks.getSessionSafely.mockResolvedValue(null);

    const response = await POST(createAnalysisRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "Войдите через Google перед анализом резюме.",
    });
    expect(mocks.isDatabaseConfigured).not.toHaveBeenCalled();
    expect(mocks.getAnalysisCreditCost).not.toHaveBeenCalled();
    expect(mocks.getWalletSummary).not.toHaveBeenCalled();
  });

  test("returns 503 before parsing when analyses cannot be saved to the database", async () => {
    mocks.isDatabaseConfigured.mockReturnValue(false);

    const response = await POST(createAnalysisRequest());
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      error: "Токены временно недоступны. Попробуйте позже.",
    });
    expect(mocks.getAnalysisCreditCost).not.toHaveBeenCalled();
    expect(mocks.getWalletSummary).not.toHaveBeenCalled();
    expect(mocks.parseResumeFile).not.toHaveBeenCalled();
    expect(mocks.analyzeResumeWithOpenRouter).not.toHaveBeenCalled();
    expect(mocks.prismaTransaction).not.toHaveBeenCalled();
  });
});

const analysisFixture = {
  totalScore: 82,
  atsScore: 78,
  vacancyMatchScore: 74,
  keywordScore: 70,
  weakPoints: ["Summary lacks quantified impact."],
  strongPoints: ["Relevant frontend delivery experience."],
  recommendedFixes: [
    {
      category: "achievements",
      title: "Quantify outcomes",
      currentIssue: "Bullets describe work without measurable results.",
      suggestedFix: "Add metrics for speed, quality, conversion, or scale.",
      impact: "high",
    },
  ],
  keywordCoverage: {
    matchedKeywords: ["React", "TypeScript"],
    missingKeywords: ["accessibility"],
    recommendedKeywords: ["performance"],
    searchRankingActions: ["Add role-specific frontend keywords."],
  },
  resumeIdeas: [
    {
      title: "Add delivery metrics",
      whyItHelps: "It makes seniority and impact easier to verify.",
      exampleBullet: "Improved checkout performance by [X%] across [N] users.",
      priority: "high",
    },
  ],
  improvedResumeText:
    "Improved resume text with stronger frontend positioning and measurable outcomes.",
  coverLetter:
    "Interview preparation brief with self-presentation, HR questions, technical questions, and answer angles.",
} as const;

function createAnalysisRequest() {
  const formData = new FormData();
  formData.append("resume", new File(["resume text"], "resume.txt", { type: "text/plain" }));
  formData.append("analysisMode", "vacancy");
  formData.append("targetRole", "Frontend Engineer");
  formData.append("salaryMin", "");
  formData.append("salaryMax", "");
  formData.append("salaryCurrency", "USD");
  formData.append("vacancyText", "React vacancy with TypeScript and measurable delivery.");

  return new Request("http://localhost/api/analyses", {
    method: "POST",
    body: formData,
  });
}

function createAnalysisTransactionClient() {
  return {
    resume: {
      create: vi.fn().mockResolvedValue({
        id: "resume-1",
      }),
    },
    analysis: {
      create: vi.fn().mockResolvedValue({
        id: "analysis-1",
        createdAt: new Date("2026-05-09T12:00:00.000Z"),
      }),
    },
  };
}
