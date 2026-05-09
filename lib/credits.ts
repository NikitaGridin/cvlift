import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import {
  ANALYSIS_CREDIT_COST,
  creditPackages,
  type WalletSummary,
} from "@/lib/credits-public";

type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

const zeroWallet: WalletSummary = {
  balance: 0,
  lifetimeCredits: 0,
  spentCredits: 0,
};

export class InsufficientCreditsError extends Error {
  status: number;

  constructor() {
    super("Not enough CV Credits to analyze a resume.");
    this.name = "InsufficientCreditsError";
    this.status = 402;
  }
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
) {
  const wallet = await tx.wallet.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  const debit = await tx.wallet.updateMany({
    where: {
      id: wallet.id,
      balance: { gte: ANALYSIS_CREDIT_COST },
    },
    data: {
      balance: { decrement: ANALYSIS_CREDIT_COST },
      spentCredits: { increment: ANALYSIS_CREDIT_COST },
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
      credits: -ANALYSIS_CREDIT_COST,
      balanceAfter: updatedWallet.balance,
      description: "Resume analysis",
    },
  });

  return updatedWallet;
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
