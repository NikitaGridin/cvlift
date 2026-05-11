import { hasRealEnv } from "@/lib/env";

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3";
const YOOKASSA_SHOP_ID_ENV = "YOOKASSA_SHOP_ID";
const YOOKASSA_SECRET_KEY_ENV = "YOOKASSA_SECRET_KEY";

type YooKassaAmount = {
  value: string;
  currency: string;
};

export type YooKassaPaymentStatus = "pending" | "waiting_for_capture" | "succeeded" | "canceled";

export type YooKassaPayment = {
  id: string;
  status: YooKassaPaymentStatus | string;
  paid: boolean;
  amount: YooKassaAmount;
  confirmation?: {
    type?: string;
    confirmation_url?: string;
  };
  metadata?: Record<string, string | undefined>;
};

export type YooKassaNotification = {
  type: "notification";
  event: string;
  object: YooKassaPayment;
};

export class YooKassaApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, details: unknown) {
    super("YooKassa API request failed.");
    this.name = "YooKassaApiError";
    this.status = status;
    this.details = details;
  }
}

export function isYooKassaConfigured() {
  return hasRealEnv(YOOKASSA_SHOP_ID_ENV) && hasRealEnv(YOOKASSA_SECRET_KEY_ENV);
}

export async function createYooKassaPayment({
  amountRubles,
  credits,
  idempotenceKey,
  packageId,
  returnUrl,
  topUpId,
  userId,
}: {
  amountRubles: number;
  credits: number;
  idempotenceKey: string;
  packageId: string;
  returnUrl: string;
  topUpId: string;
  userId: string;
}) {
  return yookassaRequest<YooKassaPayment>("/payments", {
    method: "POST",
    idempotenceKey,
    body: {
      amount: {
        value: formatYooKassaAmount(amountRubles),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: returnUrl,
      },
      description: `Пополнение баланса OfferLyra: ${credits} токенов`,
      metadata: {
        top_up_id: topUpId,
        user_id: userId,
        package_id: packageId,
        credits: String(credits),
      },
    },
  });
}

export async function getYooKassaPayment(paymentId: string) {
  return yookassaRequest<YooKassaPayment>(`/payments/${encodeURIComponent(paymentId)}`, {
    method: "GET",
  });
}

export function getYooKassaConfirmationUrl(payment: YooKassaPayment) {
  return payment.confirmation?.type === "redirect"
    ? payment.confirmation.confirmation_url
    : undefined;
}

export function isYooKassaPaymentSucceeded(payment: YooKassaPayment) {
  return payment.status === "succeeded" && payment.paid;
}

function formatYooKassaAmount(amountRubles: number) {
  return amountRubles.toFixed(2);
}

async function yookassaRequest<T>(
  path: string,
  init: {
    method: "GET" | "POST";
    body?: Record<string, unknown>;
    idempotenceKey?: string;
  },
) {
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: getAuthorizationHeader(),
  };

  if (init.body) {
    headers["Content-Type"] = "application/json";
  }

  if (init.idempotenceKey) {
    headers["Idempotence-Key"] = init.idempotenceKey;
  }

  const response = await fetch(`${YOOKASSA_API_URL}${path}`, {
    method: init.method,
    headers,
    cache: "no-store",
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const body = await parseJsonSafely(response);

  if (!response.ok) {
    throw new YooKassaApiError(response.status, body);
  }

  return body as T;
}

function getAuthorizationHeader() {
  const shopId = process.env[YOOKASSA_SHOP_ID_ENV]?.trim();
  const secretKey = process.env[YOOKASSA_SECRET_KEY_ENV]?.trim();

  if (!shopId || !secretKey) {
    throw new Error("YooKassa credentials are not configured.");
  }

  return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`;
}

async function parseJsonSafely(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
