import { afterEach, describe, expect, test, vi } from "vitest";
import { ANALYSIS_CREDIT_COST } from "@/lib/credits-public";
import {
  InsufficientCreditsError,
  getAnalysisCreditCost,
  getResumeAgentConversationCreditCost,
  isFreeResumeAnalysisEnabled,
  spendAnalysisCredit,
  spendResumeAgentConversationCredit,
} from "@/lib/credits";
import { isEnvFlagEnabled } from "@/lib/env";

type SpendAnalysisCreditTransaction = Parameters<typeof spendAnalysisCredit>[0];
type SpendResumeAgentConversationCreditTransaction = Parameters<
  typeof spendResumeAgentConversationCredit
>[0];

vi.mock("@/lib/prisma", () => ({
  isDatabaseConfigured: vi.fn(),
  prisma: {
    $transaction: vi.fn(),
  },
}));

const originalFreeAnalysisEnv = process.env.FREE_RESUME_ANALYSIS_ENABLED;

afterEach(() => {
  if (originalFreeAnalysisEnv === undefined) {
    delete process.env.FREE_RESUME_ANALYSIS_ENABLED;
  } else {
    process.env.FREE_RESUME_ANALYSIS_ENABLED = originalFreeAnalysisEnv;
  }
});

describe("free resume analysis env flag", () => {
  test.each(["true", "TRUE", " true ", "1", "yes", "on"])(
    "treats %j as enabled",
    (value) => {
      process.env.FREE_RESUME_ANALYSIS_ENABLED = value;

      expect(isEnvFlagEnabled("FREE_RESUME_ANALYSIS_ENABLED")).toBe(true);
      expect(isFreeResumeAnalysisEnabled()).toBe(true);
      expect(getAnalysisCreditCost()).toBe(0);
      expect(getResumeAgentConversationCreditCost()).toBe(0);
    },
  );

  test.each([undefined, "", "false", "0", "no", "off", "replace-with-free-mode"])(
    "treats %j as disabled",
    (value) => {
      if (value === undefined) {
        delete process.env.FREE_RESUME_ANALYSIS_ENABLED;
      } else {
        process.env.FREE_RESUME_ANALYSIS_ENABLED = value;
      }

      expect(isEnvFlagEnabled("FREE_RESUME_ANALYSIS_ENABLED")).toBe(false);
      expect(isFreeResumeAnalysisEnabled()).toBe(false);
      expect(getAnalysisCreditCost()).toBe(ANALYSIS_CREDIT_COST);
      expect(getResumeAgentConversationCreditCost()).toBe(ANALYSIS_CREDIT_COST);
    },
  );
});

describe("spendAnalysisCredit", () => {
  test("does not touch wallet tables when analysis cost is zero", async () => {
    const tx = createCreditTransactionClient();

    await expect(
      spendAnalysisCredit(asSpendTransaction(tx), "user-1", "analysis-1", 0),
    ).resolves.toBeNull();

    expect(tx.wallet.upsert).not.toHaveBeenCalled();
    expect(tx.wallet.updateMany).not.toHaveBeenCalled();
    expect(tx.wallet.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  test("debits the requested analysis cost and records a wallet transaction", async () => {
    const tx = createCreditTransactionClient({
      wallet: { id: "wallet-1", balance: 5 },
      updatedWallet: { id: "wallet-1", balance: 2 },
    });

    await expect(
      spendAnalysisCredit(asSpendTransaction(tx), "user-1", "analysis-1", 3),
    ).resolves.toMatchObject({ id: "wallet-1", balance: 2 });

    expect(tx.wallet.upsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      create: { userId: "user-1" },
      update: {},
    });
    expect(tx.wallet.updateMany).toHaveBeenCalledWith({
      where: {
        id: "wallet-1",
        balance: { gte: 3 },
      },
      data: {
        balance: { decrement: 3 },
        spentCredits: { increment: 3 },
      },
    });
    expect(tx.walletTransaction.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        walletId: "wallet-1",
        analysisId: "analysis-1",
        type: "analysis_spend",
        credits: -3,
        balanceAfter: 2,
        description: "Resume analysis",
      },
    });
  });

  test("throws and skips transaction logging when the wallet cannot cover the cost", async () => {
    const tx = createCreditTransactionClient({ debitCount: 0 });

    await expect(
      spendAnalysisCredit(asSpendTransaction(tx), "user-1", "analysis-1", 1),
    ).rejects.toBeInstanceOf(InsufficientCreditsError);

    expect(tx.wallet.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
  });
});

describe("spendResumeAgentConversationCredit", () => {
  test("does not touch wallet tables when agent conversation cost is zero", async () => {
    const tx = createCreditTransactionClient();

    await expect(
      spendResumeAgentConversationCredit(
        asSpendResumeAgentTransaction(tx),
        "user-1",
        "00000000-0000-4000-8000-000000000001",
        0,
      ),
    ).resolves.toBeNull();

    expect(tx.wallet.upsert).not.toHaveBeenCalled();
    expect(tx.wallet.updateMany).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  test("does not debit twice for the same resume agent conversation", async () => {
    const tx = createCreditTransactionClient({
      existingWalletTransaction: { id: "resume-agent-existing" },
    });

    await expect(
      spendResumeAgentConversationCredit(
        asSpendResumeAgentTransaction(tx),
        "user-1",
        "00000000-0000-4000-8000-000000000001",
        1,
      ),
    ).resolves.toBeNull();

    expect(tx.walletTransaction.findUnique).toHaveBeenCalledWith({
      where: {
        id: "resume-agent-00000000-0000-4000-8000-000000000001",
      },
    });
    expect(tx.wallet.updateMany).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  test("debits one credit for a new resume agent conversation", async () => {
    const tx = createCreditTransactionClient({
      wallet: { id: "wallet-1", balance: 2 },
      updatedWallet: { id: "wallet-1", balance: 1 },
    });

    await expect(
      spendResumeAgentConversationCredit(
        asSpendResumeAgentTransaction(tx),
        "user-1",
        "00000000-0000-4000-8000-000000000001",
        1,
      ),
    ).resolves.toMatchObject({ id: "wallet-1", balance: 1 });

    expect(tx.wallet.updateMany).toHaveBeenCalledWith({
      where: {
        id: "wallet-1",
        balance: { gte: 1 },
      },
      data: {
        balance: { decrement: 1 },
        spentCredits: { increment: 1 },
      },
    });
    expect(tx.walletTransaction.create).toHaveBeenCalledWith({
      data: {
        id: "resume-agent-00000000-0000-4000-8000-000000000001",
        userId: "user-1",
        walletId: "wallet-1",
        type: "resume_agent_spend",
        credits: -1,
        balanceAfter: 1,
        description: "AI resume agent conversation",
      },
    });
  });
});

function createCreditTransactionClient({
  debitCount = 1,
  existingWalletTransaction = null,
  wallet = { id: "wallet-1", balance: 10 },
  updatedWallet = { id: "wallet-1", balance: 9 },
}: {
  debitCount?: number;
  existingWalletTransaction?: { id: string } | null;
  wallet?: { id: string; balance: number };
  updatedWallet?: { id: string; balance: number };
} = {}) {
  return {
    wallet: {
      upsert: vi.fn().mockResolvedValue(wallet),
      updateMany: vi.fn().mockResolvedValue({ count: debitCount }),
      findUniqueOrThrow: vi.fn().mockResolvedValue(updatedWallet),
    },
    walletTransaction: {
      findUnique: vi.fn().mockResolvedValue(existingWalletTransaction),
      create: vi.fn().mockResolvedValue({ id: "wallet-transaction-1" }),
    },
  };
}

function asSpendTransaction(tx: ReturnType<typeof createCreditTransactionClient>) {
  return tx as unknown as SpendAnalysisCreditTransaction;
}

function asSpendResumeAgentTransaction(
  tx: ReturnType<typeof createCreditTransactionClient>,
) {
  return tx as unknown as SpendResumeAgentConversationCreditTransaction;
}
