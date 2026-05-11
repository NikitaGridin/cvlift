import { creditPackages } from "@/lib/credits-public";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import {
  getYooKassaPayment,
  isYooKassaConfigured,
  isYooKassaPaymentSucceeded,
  type YooKassaPayment,
} from "@/lib/yookassa";

type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export type CreditPaymentSyncStatus = "succeeded" | "pending" | "canceled" | "error";

export function getCreditPackage(packageId: string) {
  return creditPackages.find((item) => item.id === packageId) ?? null;
}

export async function syncCreditPaymentForUser(
  userId: string,
  creditPaymentId: string,
): Promise<CreditPaymentSyncStatus | null> {
  if (!isDatabaseConfigured() || !isYooKassaConfigured()) {
    return "error";
  }

  try {
    const creditPayment = await prisma.creditPayment.findFirst({
      where: {
        id: creditPaymentId,
        userId,
      },
    });

    if (!creditPayment?.yookassaPaymentId) {
      return null;
    }

    const yookassaPayment = await getYooKassaPayment(creditPayment.yookassaPaymentId);

    if (isYooKassaPaymentSucceeded(yookassaPayment)) {
      const result = await processSucceededYooKassaPayment(yookassaPayment);

      return result.reason === "credited" || result.reason === "already_credited"
        ? "succeeded"
        : "error";
    }

    if (yookassaPayment.status === "canceled") {
      await markCreditPaymentCanceled(yookassaPayment.id);
      return "canceled";
    }

    await updateCreditPaymentStatus(yookassaPayment.id, yookassaPayment.status);
    return "pending";
  } catch {
    return "error";
  }
}

export async function processSucceededYooKassaPayment(yookassaPayment: YooKassaPayment) {
  if (!isYooKassaPaymentSucceeded(yookassaPayment)) {
    return { credited: false, reason: "not_succeeded" as const };
  }

  return prisma.$transaction(async (tx) =>
    processSucceededYooKassaPaymentInTransaction(tx, yookassaPayment),
  );
}

export async function markCreditPaymentCanceled(yookassaPaymentId: string) {
  await prisma.creditPayment.updateMany({
    where: {
      yookassaPaymentId,
      creditedAt: null,
    },
    data: {
      status: "canceled",
    },
  });
}

export async function updateCreditPaymentStatus(yookassaPaymentId: string, status: string) {
  await prisma.creditPayment.updateMany({
    where: {
      yookassaPaymentId,
      creditedAt: null,
    },
    data: {
      status,
    },
  });
}

async function processSucceededYooKassaPaymentInTransaction(
  tx: PrismaTransaction,
  yookassaPayment: YooKassaPayment,
) {
  const creditPayment = await tx.creditPayment.findUnique({
    where: {
      yookassaPaymentId: yookassaPayment.id,
    },
  });

  if (!creditPayment) {
    return { credited: false, reason: "unknown_payment" as const };
  }

  if (!doesAmountMatch(creditPayment, yookassaPayment)) {
    await tx.creditPayment.update({
      where: { id: creditPayment.id },
      data: { status: "amount_mismatch" },
    });

    return { credited: false, reason: "amount_mismatch" as const };
  }

  if (creditPayment.creditedAt) {
    return { credited: false, reason: "already_credited" as const };
  }

  const claimed = await tx.creditPayment.updateMany({
    where: {
      id: creditPayment.id,
      creditedAt: null,
    },
    data: {
      status: "succeeded",
      creditedAt: new Date(),
    },
  });

  if (claimed.count !== 1) {
    return { credited: false, reason: "already_credited" as const };
  }

  const wallet = await tx.wallet.upsert({
    where: { userId: creditPayment.userId },
    create: {
      userId: creditPayment.userId,
      balance: creditPayment.credits,
      lifetimeCredits: creditPayment.credits,
    },
    update: {
      balance: { increment: creditPayment.credits },
      lifetimeCredits: { increment: creditPayment.credits },
    },
  });

  await tx.walletTransaction.create({
    data: {
      id: getWalletTransactionId(creditPayment.id),
      userId: creditPayment.userId,
      walletId: wallet.id,
      type: "top_up",
      credits: creditPayment.credits,
      balanceAfter: wallet.balance,
      description: `Пополнение баланса YooKassa: ${creditPayment.credits} токенов`,
    },
  });

  return { credited: true as const, reason: "credited" as const };
}

function doesAmountMatch(
  creditPayment: {
    amountKopecks: number;
    currency: string;
  },
  yookassaPayment: YooKassaPayment,
) {
  return (
    creditPayment.currency === yookassaPayment.amount.currency &&
    creditPayment.amountKopecks === amountValueToKopecks(yookassaPayment.amount.value)
  );
}

function amountValueToKopecks(value: string) {
  const [rubles = "0", kopecks = ""] = value.split(".");
  const normalizedKopecks = kopecks.padEnd(2, "0").slice(0, 2);

  return Number.parseInt(rubles, 10) * 100 + Number.parseInt(normalizedKopecks, 10);
}

function getWalletTransactionId(creditPaymentId: string) {
  return `top-up-${creditPaymentId}`;
}
