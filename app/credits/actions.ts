"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUserSession } from "@/lib/auth-required";
import { getCreditPackage, processSucceededYooKassaPayment } from "@/lib/credit-payments";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/site-url";
import {
  createYooKassaPayment,
  getYooKassaConfirmationUrl,
  isYooKassaConfigured,
  isYooKassaPaymentSucceeded,
} from "@/lib/yookassa";

export type CreateTopUpState = {
  error?: string;
};

const topUpSchema = z.object({
  packageId: z.string().min(1),
});

export async function createYooKassaTopUp(
  _state: CreateTopUpState,
  formData: FormData,
): Promise<CreateTopUpState> {
  const session = await requireUserSession();
  let redirectTo: string | null = null;

  try {
    if (!isDatabaseConfigured()) {
      return { error: "Пополнение баланса временно недоступно." };
    }

    if (!isYooKassaConfigured()) {
      return { error: "YooKassa не настроена. Добавьте ключи магазина в переменные окружения." };
    }

    const parsed = topUpSchema.safeParse({
      packageId: formData.get("packageId"),
    });

    if (!parsed.success) {
      return { error: "Выберите пакет токенов." };
    }

    const creditPackage = getCreditPackage(parsed.data.packageId);

    if (!creditPackage) {
      return { error: "Пакет токенов не найден." };
    }

    const creditPayment = await prisma.creditPayment.create({
      data: {
        userId: session.user.id,
        packageId: creditPackage.id,
        credits: creditPackage.credits,
        amountKopecks: creditPackage.amountRubles * 100,
        currency: "RUB",
        idempotenceKey: randomUUID(),
      },
    });

    const yookassaPayment = await createYooKassaPayment({
      amountRubles: creditPackage.amountRubles,
      credits: creditPackage.credits,
      idempotenceKey: creditPayment.idempotenceKey,
      packageId: creditPackage.id,
      returnUrl: absoluteUrl(`/credits?topUp=${creditPayment.id}`),
      topUpId: creditPayment.id,
      userId: session.user.id,
    });

    const confirmationUrl = getYooKassaConfirmationUrl(yookassaPayment);

    await prisma.creditPayment.update({
      where: { id: creditPayment.id },
      data: {
        yookassaPaymentId: yookassaPayment.id,
        status: yookassaPayment.status,
        confirmationUrl,
      },
    });

    if (confirmationUrl) {
      redirectTo = confirmationUrl;
    } else if (isYooKassaPaymentSucceeded(yookassaPayment)) {
      await processSucceededYooKassaPayment(yookassaPayment);
      redirectTo = `/credits?topUp=${creditPayment.id}`;
    } else {
      return { error: "YooKassa не вернула ссылку для оплаты. Попробуйте еще раз." };
    }
  } catch (error) {
    return { error: getTopUpErrorMessage(error) };
  }

  if (!redirectTo) {
    return { error: "YooKassa не вернула ссылку для оплаты. Попробуйте еще раз." };
  }

  redirect(redirectTo);
}

function getTopUpErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.includes("credentials")) {
    return "YooKassa не настроена. Проверьте ключи магазина.";
  }

  return "Не удалось создать платеж YooKassa. Попробуйте позже.";
}
