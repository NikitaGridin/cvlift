import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/trainer/start/route";

const mocks = vi.hoisted(() => ({
  chargeTrainerTestStart: vi.fn(),
  getSessionSafely: vi.fn(),
  getWalletSummary: vi.fn(),
  InsufficientCreditsError: class InsufficientCreditsError extends Error {
    status = 402;

    constructor(message = "Недостаточно поинтов для открытия теста.") {
      super(message);
      this.name = "InsufficientCreditsError";
    }
  },
}));

vi.mock("@/lib/trainer-test-credits", () => ({
  chargeTrainerTestStart: mocks.chargeTrainerTestStart,
}));

vi.mock("@/lib/credits", () => ({
  getWalletSummary: mocks.getWalletSummary,
  InsufficientCreditsError: mocks.InsufficientCreditsError,
}));

vi.mock("@/lib/server-data", () => ({
  getSessionSafely: mocks.getSessionSafely,
}));

beforeEach(() => {
  vi.clearAllMocks();

  mocks.getSessionSafely.mockResolvedValue({
    user: { id: "user-1" },
  });
  mocks.getWalletSummary.mockResolvedValue({
    balance: 7,
    lifetimeCredits: 7,
    spentCredits: 0,
  });
  mocks.chargeTrainerTestStart.mockResolvedValue({
    charged: false,
    unlocked: false,
    wallet: null,
  });
});

describe("POST /api/trainer/start", () => {
  test("requires a signed-in user", async () => {
    mocks.getSessionSafely.mockResolvedValue(null);

    const response = await POST(createStartRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Войдите, чтобы открыть тест." });
    expect(mocks.chargeTrainerTestStart).not.toHaveBeenCalled();
  });

  test("opens one of the first four topic tests for free", async () => {
    const response = await POST(createStartRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      baseCreditCost: 0,
      balance: 7,
      charged: false,
      creditCost: 0,
      questionCount: 20,
      testReference: "frontend:junior:javascript-basics",
      unlocked: false,
    });
    expect(mocks.chargeTrainerTestStart).toHaveBeenCalledWith(
      "user-1",
      "frontend:junior:javascript-basics",
      0,
    );
  });

  test("charges two points for paid topic tests", async () => {
    mocks.chargeTrainerTestStart.mockResolvedValue({
      charged: true,
      unlocked: true,
      wallet: { balance: 5 },
    });

    const response = await POST(
      createStartRequest({
        mode: "topic",
        specialty: "frontend",
        grade: "junior",
        topicId: "typescript",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      baseCreditCost: 2,
      balance: 5,
      charged: true,
      creditCost: 2,
      questionCount: 20,
      testReference: "frontend:junior:typescript",
      unlocked: true,
    });
    expect(mocks.chargeTrainerTestStart).toHaveBeenCalledWith(
      "user-1",
      "frontend:junior:typescript",
      2,
    );
  });

  test("opens an already unlocked paid topic test without another charge", async () => {
    mocks.chargeTrainerTestStart.mockResolvedValue({
      charged: false,
      unlocked: true,
      wallet: null,
    });
    mocks.getWalletSummary.mockResolvedValue({
      balance: 5,
      lifetimeCredits: 7,
      spentCredits: 2,
    });

    const response = await POST(
      createStartRequest({
        mode: "topic",
        specialty: "frontend",
        grade: "junior",
        topicId: "typescript",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      baseCreditCost: 2,
      balance: 5,
      charged: false,
      creditCost: 0,
      questionCount: 20,
      testReference: "frontend:junior:typescript",
      unlocked: true,
    });
  });

  test("charges ten credits for the all-questions test", async () => {
    mocks.chargeTrainerTestStart.mockResolvedValue({
      charged: true,
      unlocked: true,
      wallet: { balance: 0 },
    });

    const response = await POST(createStartRequest({ mode: "all" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      baseCreditCost: 10,
      balance: 0,
      charged: true,
      creditCost: 10,
      questionCount: 600,
      testReference: "all-topics-and-grades",
      unlocked: true,
    });
    expect(mocks.chargeTrainerTestStart).toHaveBeenCalledWith(
      "user-1",
      "all-topics-and-grades",
      10,
    );
  });

  test("does not charge empty backend tests", async () => {
    const response = await POST(
      createStartRequest({
        mode: "topic",
        specialty: "backend",
        grade: "junior",
        topicId: "nodejs-basics",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "В этом тесте пока нет вопросов." });
    expect(mocks.chargeTrainerTestStart).not.toHaveBeenCalled();
  });

  test("returns 402 when there are not enough points", async () => {
    mocks.chargeTrainerTestStart.mockRejectedValue(
      new mocks.InsufficientCreditsError(),
    );

    const response = await POST(
      createStartRequest({
        mode: "topic",
        specialty: "frontend",
        grade: "junior",
        topicId: "typescript",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(402);
    expect(body).toEqual({
      error: "Недостаточно поинтов для открытия теста.",
    });
  });
});

function createStartRequest(body: Record<string, unknown> = {
  mode: "topic",
  specialty: "frontend",
  grade: "junior",
  topicId: "javascript-basics",
}) {
  return new Request("http://localhost/api/trainer/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
