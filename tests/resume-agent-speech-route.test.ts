import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/resume-agent/speech/route";

const mocks = vi.hoisted(() => ({
  getSessionSafely: vi.fn(),
  synthesizeOpenRouterSpeech: vi.fn(),
}));

vi.mock("@/lib/openrouter-tts", () => ({
  TextToSpeechUnavailableError: class TextToSpeechUnavailableError extends Error {
    status = 503;

    constructor() {
      super("High-quality voice is not configured.");
      this.name = "TextToSpeechUnavailableError";
    }
  },
  synthesizeOpenRouterSpeech: mocks.synthesizeOpenRouterSpeech,
}));

vi.mock("@/lib/server-data", () => ({
  getSessionSafely: mocks.getSessionSafely,
}));

beforeEach(() => {
  vi.clearAllMocks();

  mocks.getSessionSafely.mockResolvedValue({
    user: { id: "user-1" },
  });
  mocks.synthesizeOpenRouterSpeech.mockResolvedValue({
    audio: new Uint8Array([1, 2, 3]).buffer,
    contentType: "audio/mpeg",
  });
});

describe("POST /api/resume-agent/speech", () => {
  test("requires a signed-in user", async () => {
    mocks.getSessionSafely.mockResolvedValue(null);

    const response = await POST(createSpeechRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "Sign in before using high-quality voice.",
    });
    expect(mocks.synthesizeOpenRouterSpeech).not.toHaveBeenCalled();
  });

  test("validates request body before generating speech", async () => {
    const response = await POST(
      new Request("http://localhost/api/resume-agent/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Send text up to 4096 characters." });
    expect(mocks.synthesizeOpenRouterSpeech).not.toHaveBeenCalled();
  });

  test("returns MP3 audio from the TTS provider", async () => {
    const response = await POST(createSpeechRequest());
    const audio = new Uint8Array(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("audio/mpeg");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(Array.from(audio)).toEqual([1, 2, 3]);
    expect(mocks.synthesizeOpenRouterSpeech).toHaveBeenCalledWith({
      locale: "ru",
      text: "Прочитай это качественным голосом.",
    });
  });

  test("returns 503 when high-quality voice is not configured", async () => {
    const { TextToSpeechUnavailableError } = await import("@/lib/openrouter-tts");
    mocks.synthesizeOpenRouterSpeech.mockRejectedValue(
      new TextToSpeechUnavailableError(),
    );

    const response = await POST(createSpeechRequest());
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({ error: "High-quality voice is not configured." });
  });
});

function createSpeechRequest() {
  return new Request("http://localhost/api/resume-agent/speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale: "ru",
      text: " Прочитай это качественным голосом. ",
    }),
  });
}
