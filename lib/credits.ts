import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import {
  ANALYSIS_CREDIT_COST,
  creditPackages,
  type WalletSummary,
} from "@/lib/credits-public";
import { isEnvFlagEnabled } from "@/lib/env";

type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
const FREE_RESUME_ANALYSIS_ENV = "FREE_RESUME_ANALYSIS_ENABLED";

const zeroWallet: WalletSummary = {
  balance: 0,
  lifetimeCredits: 0,
  spentCredits: 0,
};

export class InsufficientCreditsError extends Error {
  status: number;

  constructor(message = "Недостаточно токенов для проверки резюме.") {
    super(message);
    this.name = "InsufficientCreditsError";
    this.status = 402;
  }
}

export function isFreeResumeAnalysisEnabled() {
  return isEnvFlagEnabled(FREE_RESUME_ANALYSIS_ENV);
}

export function getAnalysisCreditCost() {
  return isFreeResumeAnalysisEnabled() ? 0 : ANALYSIS_CREDIT_COST;
}

export function getResumeAgentConversationCreditCost() {
  return isFreeResumeAnalysisEnabled() ? 0 : ANALYSIS_CREDIT_COST;
}

export async function getWalletSummary(userId: string): Promise<WalletSummary> {
  if (!isDatabaseConfigured()) {
    return zeroWallet;
  }

  try {
    const wallet = await ensureWallet(userId);
    return toWalletSummary(wallet);
  } catch {
    return zeroWallet;
  }
}

export async function getCreditsPageData(userId: string) {
  if (!isDatabaseConfigured()) {
    return {
      summary: zeroWallet,
      packages: creditPackages,
    };
  }

  try {
    const wallet = await ensureWallet(userId);

    return {
      summary: toWalletSummary(wallet),
      packages: creditPackages,
    };
  } catch {
    return {
      summary: zeroWallet,
      packages: creditPackages,
    };
  }
}

export async function spendAnalysisCredit(
  tx: PrismaTransaction,
  userId: string,
  analysisId: string,
  analysisCreditCost = getAnalysisCreditCost(),
) {
  if (analysisCreditCost === 0) {
    return null;
  }

  const wallet = await tx.wallet.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  const debit = await tx.wallet.updateMany({
    where: {
      id: wallet.id,
      balance: { gte: analysisCreditCost },
    },
    data: {
      balance: { decrement: analysisCreditCost },
      spentCredits: { increment: analysisCreditCost },
    },
  });

  if (debit.count !== 1) {
    throw new InsufficientCreditsError();
  }

  const updatedWallet = await tx.wallet.findUniqueOrThrow({
    where: { id: wallet.id },
  });

  await tx.walletTransaction.create({
    data: {
      userId,
      walletId: wallet.id,
      analysisId,
      type: "analysis_spend",
      credits: -analysisCreditCost,
      balanceAfter: updatedWallet.balance,
      description: "Resume analysis",
    },
  });

  return updatedWallet;
}

export async function spendResumeAgentConversationCredit(
  tx: PrismaTransaction,
  userId: string,
  conversationId: string,
  conversationCreditCost = getResumeAgentConversationCreditCost(),
) {
  if (conversationCreditCost === 0) {
    return null;
  }

  const transactionId = getResumeAgentConversationTransactionId(conversationId);
  const existingTransaction = await tx.walletTransaction.findUnique({
    where: { id: transactionId },
  });

  if (existingTransaction) {
    return null;
  }

  const wallet = await tx.wallet.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  const debit = await tx.wallet.updateMany({
    where: {
      id: wallet.id,
      balance: { gte: conversationCreditCost },
    },
    data: {
      balance: { decrement: conversationCreditCost },
      spentCredits: { increment: conversationCreditCost },
    },
  });

  if (debit.count !== 1) {
    throw new InsufficientCreditsError(
      "Недостаточно токенов для запуска разговора о резюме.",
    );
  }

  const updatedWallet = await tx.wallet.findUniqueOrThrow({
    where: { id: wallet.id },
  });

  await tx.walletTransaction.create({
    data: {
      id: transactionId,
      userId,
      walletId: wallet.id,
      type: "resume_agent_spend",
      credits: -conversationCreditCost,
      balanceAfter: updatedWallet.balance,
      description: "AI resume agent conversation",
    },
  });

  return updatedWallet;
}

function getResumeAgentConversationTransactionId(conversationId: string) {
  return `resume-agent-${conversationId}`;
}

async function ensureWallet(userId: string) {
  return prisma.wallet.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

function toWalletSummary(wallet: WalletSummary): WalletSummary {
  return {
    balance: wallet.balance,
    lifetimeCredits: wallet.lifetimeCredits,
    spentCredits: wallet.spentCredits,
  };
}
