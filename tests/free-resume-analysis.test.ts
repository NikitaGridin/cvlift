import { afterEach, describe, expect, test, vi } from "vitest";
import { ANALYSIS_CREDIT_COST } from "@/lib/credits-public";
import {
  InsufficientCreditsError,
  getAnalysisCreditCost,
  getResumeAgentConversationCreditCost,
  isFreeResumeAnalysisEnabled,
  spendAnalysisCredit,
  spendResumeAgentConversationCredit,
  spendTrainerTestCredit,
} from "@/lib/credits";
import { isEnvFlagEnabled } from "@/lib/env";

type SpendAnalysisCreditTransaction = Parameters<typeof spendAnalysisCredit>[0];
type SpendResumeAgentConversationCreditTransaction = Parameters<
  typeof spendResumeAgentConversationCredit
>[0];
type SpendTrainerTestCreditTransaction = Parameters<typeof spendTrainerTestCredit>[0];

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

describe("spendTrainerTestCredit", () => {
  test("does not touch wallet tables when trainer test cost is zero", async () => {
    const tx = createCreditTransactionClient();

    await expect(
      spendTrainerTestCredit(
        asSpendTrainerTestTransaction(tx),
        "user-1",
        "frontend:junior:javascript-basics",
        0,
        "trainer-test-unlock:user-1:frontend:junior:javascript-basics",
      ),
    ).resolves.toBeNull();

    expect(tx.wallet.upsert).not.toHaveBeenCalled();
    expect(tx.wallet.updateMany).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  test("does not debit twice for an already unlocked trainer test", async () => {
    const tx = createCreditTransactionClient({
      existingWalletTransaction: {
        id: "trainer-test-unlock:user-1:frontend:junior:typescript",
      },
    });

    await expect(
      spendTrainerTestCredit(
        asSpendTrainerTestTransaction(tx),
        "user-1",
        "frontend:junior:typescript",
        2,
        "trainer-test-unlock:user-1:frontend:junior:typescript",
      ),
    ).resolves.toBeNull();

    expect(tx.walletTransaction.findUnique).toHaveBeenCalledWith({
      where: {
        id: "trainer-test-unlock:user-1:frontend:junior:typescript",
      },
    });
    expect(tx.wallet.updateMany).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  test("debits two points for a paid trainer test unlock", async () => {
    const tx = createCreditTransactionClient({
      wallet: { id: "wallet-1", balance: 4 },
      updatedWallet: { id: "wallet-1", balance: 2 },
    });

    await expect(
      spendTrainerTestCredit(
        asSpendTrainerTestTransaction(tx),
        "user-1",
        "frontend:junior:typescript",
        2,
        "trainer-test-unlock:user-1:frontend:junior:typescript",
      ),
    ).resolves.toMatchObject({ id: "wallet-1", balance: 2 });

    expect(tx.walletTransaction.findUnique).toHaveBeenCalledWith({
      where: {
        id: "trainer-test-unlock:user-1:frontend:junior:typescript",
      },
    });
    expect(tx.wallet.updateMany).toHaveBeenCalledWith({
      where: {
        id: "wallet-1",
        balance: { gte: 2 },
      },
      data: {
        balance: { decrement: 2 },
        spentCredits: { increment: 2 },
      },
    });
    expect(tx.walletTransaction.create).toHaveBeenCalledWith({
      data: {
        id: "trainer-test-unlock:user-1:frontend:junior:typescript",
        userId: "user-1",
        walletId: "wallet-1",
        type: "trainer_test_unlock",
        credits: -2,
        balanceAfter: 2,
        description:
          "Technical interview trainer test unlock: frontend:junior:typescript",
      },
    });
  });

  test("throws and skips transaction logging when trainer test balance is not enough", async () => {
    const tx = createCreditTransactionClient({ debitCount: 0 });

    await expect(
      spendTrainerTestCredit(
        asSpendTrainerTestTransaction(tx),
        "user-1",
        "frontend:junior:typescript",
        2,
        "trainer-test-unlock:user-1:frontend:junior:typescript",
      ),
    ).rejects.toBeInstanceOf(InsufficientCreditsError);

    expect(tx.wallet.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
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

function asSpendTrainerTestTransaction(
  tx: ReturnType<typeof createCreditTransactionClient>,
) {
  return tx as unknown as SpendTrainerTestCreditTransaction;
}
