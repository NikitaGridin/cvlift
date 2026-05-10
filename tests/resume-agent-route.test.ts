import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/resume-agent/route";

const mocks = vi.hoisted(() => ({
  chatWithResumeAgent: vi.fn(),
  getSessionSafely: vi.fn(),
  getResumeAgentConversationCreditCost: vi.fn(),
  isDatabaseConfigured: vi.fn(),
  prismaTransaction: vi.fn(),
  spendResumeAgentConversationCredit: vi.fn(),
  streamWithResumeAgent: vi.fn(),
  InsufficientCreditsError: class InsufficientCreditsError extends Error {
    status = 402;

    constructor(message = "Недостаточно токенов для запуска разговора о резюме.") {
      super(message);
      this.name = "InsufficientCreditsError";
    }
  },
}));

vi.mock("@/lib/credits", () => ({
  InsufficientCreditsError: mocks.InsufficientCreditsError,
  getResumeAgentConversationCreditCost: mocks.getResumeAgentConversationCreditCost,
  spendResumeAgentConversationCredit: mocks.spendResumeAgentConversationCredit,
}));

vi.mock("@/lib/openrouter-resume-agent", () => ({
  chatWithResumeAgent: mocks.chatWithResumeAgent,
  streamWithResumeAgent: mocks.streamWithResumeAgent,
}));

vi.mock("@/lib/prisma", () => ({
  isDatabaseConfigured: mocks.isDatabaseConfigured,
  prisma: {
    $transaction: mocks.prismaTransaction,
  },
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
  mocks.getResumeAgentConversationCreditCost.mockReturnValue(0);
  mocks.isDatabaseConfigured.mockReturnValue(true);
  mocks.prismaTransaction.mockImplementation((callback) => callback("tx"));
  mocks.spendResumeAgentConversationCredit.mockResolvedValue(null);
  mocks.chatWithResumeAgent.mockResolvedValue({
    isFinal: false,
    reply: "Tell me about your strongest measurable achievement.",
    model: "test-model",
  });
  mocks.streamWithResumeAgent.mockResolvedValue({
    isFinal: false,
    deltas: createDeltaStream(["Tell me ", "about the role."]),
    model: "test-model",
  });
});

describe("POST /api/resume-agent", () => {
  test("requires a signed-in user", async () => {
    mocks.getSessionSafely.mockResolvedValue(null);

    const response = await POST(createAgentRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "Войдите, чтобы общаться с помощником по резюме.",
    });
    expect(mocks.chatWithResumeAgent).not.toHaveBeenCalled();
  });

  test("validates JSON request shape before calling OpenRouter", async () => {
    const response = await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "Отправьте сообщения чата с ролью и текстом.",
    });
    expect(mocks.chatWithResumeAgent).not.toHaveBeenCalled();
  });

  test("returns 400 for invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{bad-json",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Некорректный JSON в теле запроса." });
    expect(mocks.chatWithResumeAgent).not.toHaveBeenCalled();
  });

  test("passes locale, user id, and trimmed messages to the resume agent", async () => {
    const response = await POST(createAgentRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      isFinal: false,
      reply: "Tell me about your strongest measurable achievement.",
    });
    expect(mocks.chatWithResumeAgent).toHaveBeenCalledWith({
      collectedAnswers: ["Frontend developer"],
      locale: "ru",
      userId: "user-1",
      shouldProduceResume: false,
      messages: [
        {
          role: "assistant",
          content: "Привет. Под какую роль готовим резюме?",
        },
        {
          role: "user",
          content: "Frontend developer",
        },
      ],
    });
  });

  test("accepts a long conversation and passes only the latest context messages", async () => {
    const messages = Array.from({ length: 30 }, (_, index) => ({
      role: index % 2 === 0 ? "assistant" : "user",
      content: ` Message ${index + 1} `,
    }));

    const response = await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, locale: "ru", messages }),
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.chatWithResumeAgent).toHaveBeenCalledWith({
      collectedAnswers: messages
        .filter((message) => message.role === "user")
        .map((message) => message.content.trim()),
      locale: "ru",
      userId: "user-1",
      shouldProduceResume: false,
      messages: messages.slice(-10).map((message) => ({
        role: message.role,
        content: message.content.trim(),
      })),
    });
  });

  test("uses collected answers from the client even when older facts are outside the message window", async () => {
    const response = await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectedAnswers: [
            "Target role: Senior Frontend Engineer",
            "Worked with React, TypeScript, Next.js",
            "Led UI performance improvements",
          ],
          conversationId,
          locale: "ru",
          messages: [
            {
              role: "assistant",
              content: "What achievements should we include?",
            },
            {
              role: "user",
              content: "Reduced page load time by 35%.",
            },
          ],
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.chatWithResumeAgent).toHaveBeenCalledWith({
      collectedAnswers: [
        "Target role: Senior Frontend Engineer",
        "Worked with React, TypeScript, Next.js",
        "Led UI performance improvements",
      ],
      locale: "ru",
      userId: "user-1",
      shouldProduceResume: false,
      messages: [
        {
          role: "assistant",
          content: "What achievements should we include?",
        },
        {
          role: "user",
          content: "Reduced page load time by 35%.",
        },
      ],
    });
  });

  test("switches to final resume mode when the user asks for a resume", async () => {
    await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          locale: "ru",
          messages: [
            {
              role: "user",
              content: "Готово, собери резюме.",
            },
          ],
        }),
      }),
    );

    expect(mocks.chatWithResumeAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldProduceResume: true,
      }),
    );
  });

  test("does not switch to final mode just because the user mentions a resume", async () => {
    await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          locale: "ru",
          messages: [
            {
              role: "user",
              content:
                "Хочу резюме под frontend, ищу удаленно, доход от 300 тысяч.",
            },
          ],
        }),
      }),
    );

    expect(mocks.chatWithResumeAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldProduceResume: false,
      }),
    );
  });

  test("auto-finalizes only after search, company, and personal sections are covered", async () => {
    await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          locale: "ru",
          collectedAnswers: [
            "Ищу работу удаленно или в Москве, вакансия Frontend developer, доход от 300 тысяч рублей.",
            "Работал в компании Alpha с 2021 по 2023 frontend-разработчиком.",
            "Обязанности: разрабатывал интерфейсы, вел проект, стек React и TypeScript.",
            "Достижение: улучшил метрику загрузки на 35%, работал с командой из 6 человек.",
            "Контакты: test@example.com, Telegram @test, GitHub github.com/test.",
            "Образование: университет, бакалавр; английский язык B2.",
          ],
          messages: [
            {
              role: "user",
              content: "Образование: университет, бакалавр; английский язык B2.",
            },
          ],
        }),
      }),
    );

    expect(mocks.chatWithResumeAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldProduceResume: true,
      }),
    );
  });

  test("streams agent deltas when the client asks for a streaming response", async () => {
    const response = await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          locale: "ru",
          stream: true,
          messages: [
            {
              role: "user",
              content: "Frontend developer",
            },
          ],
        }),
      }),
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/x-ndjson");
    expect(body.trim().split("\n").map((line) => JSON.parse(line))).toEqual([
      { type: "meta", isFinal: false },
      { type: "delta", content: "Tell me " },
      { type: "delta", content: "about the role." },
      { type: "done" },
    ]);
    expect(mocks.streamWithResumeAgent).toHaveBeenCalledWith({
      collectedAnswers: ["Frontend developer"],
      locale: "ru",
      userId: "user-1",
      shouldProduceResume: false,
      messages: [
        {
          role: "user",
          content: "Frontend developer",
        },
      ],
    });
    expect(mocks.chatWithResumeAgent).not.toHaveBeenCalled();
  });

  test("returns OpenRouter errors as a 500 response", async () => {
    mocks.chatWithResumeAgent.mockRejectedValue(new Error("OpenRouter unavailable"));

    const response = await POST(createAgentRequest());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "OpenRouter unavailable" });
  });

  test("spends one token when the first message starts a paid resume conversation", async () => {
    mocks.getResumeAgentConversationCreditCost.mockReturnValue(1);

    const response = await POST(createAgentRequest());

    expect(response.status).toBe(200);
    expect(mocks.prismaTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.spendResumeAgentConversationCredit).toHaveBeenCalledWith(
      "tx",
      "user-1",
      conversationId,
      1,
    );
  });

  test("does not spend a token for later messages in the same conversation", async () => {
    mocks.getResumeAgentConversationCreditCost.mockReturnValue(1);

    const response = await POST(
      new Request("http://localhost/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          locale: "ru",
          messages: [
            { role: "user", content: "Ищу удаленно, frontend, 300 тысяч." },
            { role: "assistant", content: "Перечислите компании." },
            { role: "user", content: "Alpha и Beta." },
          ],
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.spendResumeAgentConversationCredit).not.toHaveBeenCalled();
  });

  test("does not spend a token when free resume mode is enabled", async () => {
    mocks.getResumeAgentConversationCreditCost.mockReturnValue(0);

    const response = await POST(createAgentRequest());

    expect(response.status).toBe(200);
    expect(mocks.spendResumeAgentConversationCredit).not.toHaveBeenCalled();
  });

  test("returns 402 when the user has no tokens to start the conversation", async () => {
    mocks.getResumeAgentConversationCreditCost.mockReturnValue(1);
    mocks.spendResumeAgentConversationCredit.mockRejectedValue(
      new mocks.InsufficientCreditsError(),
    );

    const response = await POST(createAgentRequest());
    const body = await response.json();

    expect(response.status).toBe(402);
    expect(body).toEqual({
      error: "Недостаточно токенов для запуска разговора о резюме.",
    });
    expect(mocks.chatWithResumeAgent).not.toHaveBeenCalled();
  });
});

async function* createDeltaStream(deltas: string[]) {
  for (const delta of deltas) {
    yield delta;
  }
}

function createAgentRequest() {
  return new Request("http://localhost/api/resume-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId,
      locale: "ru",
      messages: [
        {
          role: "assistant",
          content: " Привет. Под какую роль готовим резюме? ",
        },
        {
          role: "user",
          content: " Frontend developer ",
        },
      ],
    }),
  });
}
