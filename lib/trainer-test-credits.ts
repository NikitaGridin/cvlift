import { spendTrainerTestCredit } from "@/lib/credits";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const TRAINER_TEST_UNLOCK_TRANSACTION_PREFIX = "trainer-test-unlock";

export class TrainerTestCreditsUnavailableError extends Error {
  status = 503;

  constructor() {
    super("Поинты временно недоступны. Попробуйте позже.");
    this.name = "TrainerTestCreditsUnavailableError";
  }
}

export async function chargeTrainerTestStart(
  userId: string,
  testReference: string,
  creditCost: number,
) {
  if (creditCost === 0) {
    return {
      charged: false,
      unlocked: false,
      wallet: null,
    };
  }

  if (!isDatabaseConfigured()) {
    throw new TrainerTestCreditsUnavailableError();
  }

  const transactionId = getTrainerTestUnlockTransactionId(userId, testReference);

  return prisma.$transaction(async (tx) => {
    const existingUnlock = await tx.walletTransaction.findFirst({
      where: {
        userId,
        OR: [
          {
            id: transactionId,
            type: "trainer_test_unlock",
          },
          {
            description: getLegacyTrainerTestSpendDescription(testReference),
            type: "trainer_test_spend",
          },
        ],
      },
    });

    if (existingUnlock) {
      return {
        charged: false,
        unlocked: true,
        wallet: null,
      };
    }

    const wallet = await spendTrainerTestCredit(
      tx,
      userId,
      testReference,
      creditCost,
      transactionId,
    );

    return {
      charged: wallet !== null,
      unlocked: true,
      wallet,
    };
  });
}

export async function getUnlockedTrainerTestReferences(userId: string) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const transactions = await prisma.walletTransaction.findMany({
      where: {
        userId,
        type: { in: ["trainer_test_unlock", "trainer_test_spend"] },
      },
      select: { description: true, id: true, type: true },
    });

    return transactions.flatMap((transaction) => {
      if (transaction.type === "trainer_test_spend") {
        const legacyReference = getLegacyTrainerTestReference(
          transaction.description,
        );

        return legacyReference ? [legacyReference] : [];
      }

      const reference = getTrainerTestReferenceFromUnlockTransactionId(
        userId,
        transaction.id,
      );

      return reference ? [reference] : [];
    });
  } catch {
    return [];
  }
}

export function getTrainerTestUnlockTransactionId(
  userId: string,
  testReference: string,
) {
  return `${TRAINER_TEST_UNLOCK_TRANSACTION_PREFIX}:${userId}:${testReference}`;
}

function getTrainerTestReferenceFromUnlockTransactionId(
  userId: string,
  transactionId: string,
) {
  const prefix = `${TRAINER_TEST_UNLOCK_TRANSACTION_PREFIX}:${userId}:`;

  return transactionId.startsWith(prefix)
    ? transactionId.slice(prefix.length)
    : null;
}

function getLegacyTrainerTestReference(description: string) {
  const prefix = getLegacyTrainerTestSpendDescription("");

  return description.startsWith(prefix) ? description.slice(prefix.length) : null;
}

function getLegacyTrainerTestSpendDescription(testReference: string) {
  return `Technical interview trainer test: ${testReference}`;
}
