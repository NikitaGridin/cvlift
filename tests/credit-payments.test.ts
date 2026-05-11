import { beforeEach, describe, expect, test, vi } from "vitest";
import { processSucceededYooKassaPayment } from "@/lib/credit-payments";
import type { YooKassaPayment } from "@/lib/yookassa";

const mocks = vi.hoisted(() => ({
  prismaTransaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  isDatabaseConfigured: vi.fn(),
  prisma: {
    $transaction: mocks.prismaTransaction,
  },
}));

let tx: ReturnType<typeof createCreditPaymentTransactionClient>;

beforeEach(() => {
  vi.clearAllMocks();

  tx = createCreditPaymentTransactionClient();
  mocks.prismaTransaction.mockImplementation(
    async (callback: (transactionClient: typeof tx) => Promise<unknown>) =>
      callback(tx),
  );
});

describe("processSucceededYooKassaPayment", () => {
  test("credits a wallet once for a verified succeeded YooKassa payment", async () => {
    await expect(processSucceededYooKassaPayment(createYooKassaPayment())).resolves.toEqual({
      credited: true,
      reason: "credited",
    });

    expect(tx.creditPayment.findUnique).toHaveBeenCalledWith({
      where: { yookassaPaymentId: "yk-payment-1" },
    });
    expect(tx.creditPayment.updateMany).toHaveBeenCalledWith({
      where: {
        id: "top-up-1",
        creditedAt: null,
      },
      data: {
        status: "succeeded",
        creditedAt: expect.any(Date),
      },
    });
    expect(tx.wallet.upsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      create: {
        userId: "user-1",
        balance: 5,
        lifetimeCredits: 5,
      },
      update: {
        balance: { increment: 5 },
        lifetimeCredits: { increment: 5 },
      },
    });
    expect(tx.walletTransaction.create).toHaveBeenCalledWith({
      data: {
        id: "top-up-top-up-1",
        userId: "user-1",
        walletId: "wallet-1",
        type: "top_up",
        credits: 5,
        balanceAfter: 8,
        description: "Пополнение баланса YooKassa: 5 токенов",
      },
    });
  });

  test("skips wallet changes when the local payment was already credited", async () => {
    tx = createCreditPaymentTransactionClient({
      creditPayment: {
        id: "top-up-1",
        userId: "user-1",
        credits: 5,
        amountKopecks: 39900,
        currency: "RUB",
        creditedAt: new Date("2026-05-11T12:00:00.000Z"),
      },
    });
    mocks.prismaTransaction.mockImplementation(
      async (callback: (transactionClient: typeof tx) => Promise<unknown>) =>
        callback(tx),
    );

    await expect(processSucceededYooKassaPayment(createYooKassaPayment())).resolves.toEqual({
      credited: false,
      reason: "already_credited",
    });

    expect(tx.creditPayment.updateMany).not.toHaveBeenCalled();
    expect(tx.wallet.upsert).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  test("does not credit a wallet when the verified amount differs from the local order", async () => {
    await expect(
      processSucceededYooKassaPayment(
        createYooKassaPayment({
          amount: {
            value: "100.00",
            currency: "RUB",
          },
        }),
      ),
    ).resolves.toEqual({
      credited: false,
      reason: "amount_mismatch",
    });

    expect(tx.creditPayment.update).toHaveBeenCalledWith({
      where: { id: "top-up-1" },
      data: { status: "amount_mismatch" },
    });
    expect(tx.wallet.upsert).not.toHaveBeenCalled();
    expect(tx.walletTransaction.create).not.toHaveBeenCalled();
  });
});

function createCreditPaymentTransactionClient({
  claimedCount = 1,
  creditPayment = {
    id: "top-up-1",
    userId: "user-1",
    credits: 5,
    amountKopecks: 39900,
    currency: "RUB",
    creditedAt: null,
  },
  wallet = { id: "wallet-1", balance: 8 },
}: {
  claimedCount?: number;
  creditPayment?: {
    id: string;
    userId: string;
    credits: number;
    amountKopecks: number;
    currency: string;
    creditedAt: Date | null;
  } | null;
  wallet?: { id: string; balance: number };
} = {}) {
  return {
    creditPayment: {
      findUnique: vi.fn().mockResolvedValue(creditPayment),
      update: vi.fn().mockResolvedValue(creditPayment),
      updateMany: vi.fn().mockResolvedValue({ count: claimedCount }),
    },
    wallet: {
      upsert: vi.fn().mockResolvedValue(wallet),
    },
    walletTransaction: {
      create: vi.fn().mockResolvedValue({ id: "wallet-transaction-1" }),
    },
  };
}

function createYooKassaPayment(overrides: Partial<YooKassaPayment> = {}): YooKassaPayment {
  return {
    id: "yk-payment-1",
    status: "succeeded",
    paid: true,
    amount: {
      value: "399.00",
      currency: "RUB",
    },
    ...overrides,
  };
}
