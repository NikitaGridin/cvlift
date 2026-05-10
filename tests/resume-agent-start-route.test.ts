import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/resume-agent/start/route";

const mocks = vi.hoisted(() => ({
  chargeResumeAgentConversationStart: vi.fn(),
  getSessionSafely: vi.fn(),
  InsufficientCreditsError: class InsufficientCreditsError extends Error {
    status = 402;

    constructor(message = "Not enough CV Credits to start a resume conversation.") {
      super(message);
      this.name = "InsufficientCreditsError";
    }
  },
}));

vi.mock("@/lib/resume-agent-credits", () => ({
  chargeResumeAgentConversationStart: mocks.chargeResumeAgentConversationStart,
}));

vi.mock("@/lib/credits", () => ({
  InsufficientCreditsError: mocks.InsufficientCreditsError,
}));

vi.mock("@/lib/server-data", () => ({
  getSessionSafely: mocks.getSessionSafely,
}));

const conversationId = "00000000-0000-4000-8000-000000000001";

beforeEach(() => {
  vi.clearAllMocks();

  mocks.getSessionSafely.mockResolvedValue({
    user: { id: "user-1" },
  });
  mocks.chargeResumeAgentConversationStart.mockResolvedValue(null);
});

describe("POST /api/resume-agent/start", () => {
  test("requires a signed-in user", async () => {
    mocks.getSessionSafely.mockResolvedValue(null);

    const response = await POST(createStartRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "Sign in before talking to the resume agent.",
    });
    expect(mocks.chargeResumeAgentConversationStart).not.toHaveBeenCalled();
  });

  test("charges the resume agent conversation start once by conversation id", async () => {
    const response = await POST(createStartRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(mocks.chargeResumeAgentConversationStart).toHaveBeenCalledWith(
      "user-1",
      conversationId,
    );
  });

  test("validates the conversation id", async () => {
    const response = await POST(
      new Request("http://localhost/api/resume-agent/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: "bad-id" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Send a valid conversation id." });
    expect(mocks.chargeResumeAgentConversationStart).not.toHaveBeenCalled();
  });

  test("returns 402 when the user has no credits", async () => {
    mocks.chargeResumeAgentConversationStart.mockRejectedValue(
      new mocks.InsufficientCreditsError(),
    );

    const response = await POST(createStartRequest());
    const body = await response.json();

    expect(response.status).toBe(402);
    expect(body).toEqual({
      error: "Not enough CV Credits to start a resume conversation.",
    });
  });
});

function createStartRequest() {
  return new Request("http://localhost/api/resume-agent/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId }),
  });
}
