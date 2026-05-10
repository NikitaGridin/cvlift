import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const originalEnv = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();

  process.env = {
    ...originalEnv,
    OPENROUTER_API_KEY: "test-openrouter-key",
    OPENROUTER_INTERVIEW_MODEL: "test-fast-model",
    OPENROUTER_FINAL_MODEL: "test-final-model",
    OPENROUTER_INTERVIEW_MAX_TOKENS: "123",
    OPENROUTER_FINAL_MAX_TOKENS: "2345",
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
  process.env = { ...originalEnv };
});

describe("openrouter resume agent client", () => {
  test("uses the fast interview model with a small token budget", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        choices: [{ message: { content: "What role are you targeting?" } }],
        model: "test-fast-model",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { chatWithResumeAgent } = await import("@/lib/openrouter-resume-agent");

    const result = await chatWithResumeAgent({
      collectedAnswers: ["Frontend developer"],
      locale: "en",
      messages: [{ role: "user", content: "Frontend developer" }],
      shouldProduceResume: false,
      userId: "user-1",
    });
    const body = getRequestBody(fetchMock);

    expect(result.reply).toBe("What role are you targeting?");
    expect(body.model).toBe("test-fast-model");
    expect(body.max_tokens).toBe(123);
    expect(body.stream).toBe(false);
    expect(body.temperature).toBe(0.25);
    expect(getPromptText(body)).toContain(
      "where the user is looking for work",
    );
    expect(getPromptText(body)).toContain("Scope boundary");
    expect(getPromptText(body)).toContain("do not answer the unrelated question");
    expect(getPromptText(body)).toContain("jailbreak");
    expect(getPromptText(body)).toContain("desired income");
    expect(getPromptText(body)).toContain("companies");
    expect(getPromptText(body)).toContain("list all companies");
    expect(getPromptText(body)).toContain("source of truth");
    expect(getPromptText(body)).toContain("Never skip a listed company");
    expect(getPromptText(body)).toContain("personal section");
  });

  test("keeps final resume generation on the final model with a larger token budget", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        choices: [{ message: { content: "Final resume text" } }],
        model: "test-final-model",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { chatWithResumeAgent } = await import("@/lib/openrouter-resume-agent");

    const result = await chatWithResumeAgent({
      collectedAnswers: ["Frontend developer", "React", "Led projects"],
      locale: "en",
      messages: [{ role: "user", content: "Create the resume." }],
      shouldProduceResume: true,
      userId: "user-1",
    });
    const body = getRequestBody(fetchMock);

    expect(result.isFinal).toBe(true);
    expect(body.model).toBe("test-final-model");
    expect(body.max_tokens).toBe(2345);
    expect(body.stream).toBe(false);
    expect(body.temperature).toBe(0.3);
    expect(getPromptText(body)).toContain(".txt file");
    expect(getPromptText(body)).toContain("Scope boundary");
    expect(getPromptText(body)).toContain("continue final resume generation");
    expect(getPromptText(body)).toContain("UPPERCASE section headings");
    expect(getPromptText(body)).toContain("hyphen bullets");
    expect(getPromptText(body)).toContain("Do not use markdown tables");
    expect(getPromptText(body)).toContain("include every company");
    expect(getPromptText(body)).toContain("optimization pass");
    expect(getPromptText(body)).toContain("ATS keywords");
    expect(getPromptText(body)).toContain("adjacent technologies");
    expect(getPromptText(body)).toContain("commonly expected for this specialty");
    expect(getPromptText(body)).toContain("[confirm metric]");
  });

  test("streams OpenRouter SSE deltas as soon as they arrive", async () => {
    const encoder = new TextEncoder();
    const openRouterStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode('data: {"choices":[{"delta":{"content":"Fast "}}]}\n\n'),
        );
        controller.enqueue(
          encoder.encode('data: {"choices":[{"delta":{"content":"question"}}]}\n\n'),
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(openRouterStream, {
        headers: { "Content-Type": "text/event-stream" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { streamWithResumeAgent } = await import("@/lib/openrouter-resume-agent");

    const result = await streamWithResumeAgent({
      locale: "en",
      messages: [{ role: "user", content: "Frontend developer" }],
      shouldProduceResume: false,
      userId: "user-1",
    });
    const deltas: string[] = [];

    for await (const delta of result.deltas) {
      deltas.push(delta);
    }

    expect(deltas).toEqual(["Fast ", "question"]);
    expect(getRequestBody(fetchMock).stream).toBe(true);
  });
});

function getRequestBody(fetchMock: ReturnType<typeof vi.fn>) {
  const request = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;

  if (typeof request?.body !== "string") {
    throw new Error("Expected JSON request body.");
  }

  return JSON.parse(request.body) as Record<string, unknown>;
}

function getPromptText(body: Record<string, unknown>) {
  const messages = body.messages as Array<{ content?: string }> | undefined;

  return messages?.map((message) => message.content ?? "").join(" ") ?? "";
}
