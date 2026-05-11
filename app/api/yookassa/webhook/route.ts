import {
  markCreditPaymentCanceled,
  processSucceededYooKassaPayment,
  updateCreditPaymentStatus,
} from "@/lib/credit-payments";
import { isDatabaseConfigured } from "@/lib/prisma";
import {
  getYooKassaPayment,
  isYooKassaConfigured,
  isYooKassaPaymentSucceeded,
  type YooKassaNotification,
} from "@/lib/yookassa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isDatabaseConfigured() || !isYooKassaConfigured()) {
    return Response.json({ error: "YooKassa webhook is not configured." }, { status: 503 });
  }

  let notification: YooKassaNotification;

  try {
    notification = (await request.json()) as YooKassaNotification;
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const paymentId = notification.object?.id;

  if (!paymentId || notification.type !== "notification") {
    return Response.json({ error: "Invalid notification." }, { status: 400 });
  }

  if (!notification.event.startsWith("payment.")) {
    return Response.json({ ok: true });
  }

  let yookassaPayment;

  try {
    yookassaPayment = await getYooKassaPayment(paymentId);
  } catch {
    return Response.json({ error: "Could not verify payment status." }, { status: 502 });
  }

  if (isYooKassaPaymentSucceeded(yookassaPayment)) {
    await processSucceededYooKassaPayment(yookassaPayment);
    return Response.json({ ok: true });
  }

  if (yookassaPayment.status === "canceled") {
    await markCreditPaymentCanceled(yookassaPayment.id);
    return Response.json({ ok: true });
  }

  await updateCreditPaymentStatus(yookassaPayment.id, yookassaPayment.status);

  return Response.json({ ok: true });
}
