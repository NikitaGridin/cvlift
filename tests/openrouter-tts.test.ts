import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const originalEnv = {
  AUTH_URL: process.env.AUTH_URL,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_SITE_URL: process.env.OPENROUTER_SITE_URL,
  OPENROUTER_TTS_MODEL: process.env.OPENROUTER_TTS_MODEL,
  OPENROUTER_TTS_SPEED: process.env.OPENROUTER_TTS_SPEED,
  OPENROUTER_TTS_VOICE: process.env.OPENROUTER_TTS_VOICE,
};

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();

  process.env.OPENROUTER_API_KEY = "test-openrouter-key";
  process.env.OPENROUTER_SITE_URL = "https://offerlyra.test";
  process.env.OPENROUTER_TTS_MODEL = "openai/gpt-4o-mini-tts-2025-12-15";
  process.env.OPENROUTER_TTS_SPEED = "0.92";
  process.env.OPENROUTER_TTS_VOICE = "marin";
  delete process.env.AUTH_URL;
});

afterEach(() => {
  vi.unstubAllGlobals();

  restoreEnv("AUTH_URL", originalEnv.AUTH_URL);
  restoreEnv("OPENROUTER_API_KEY", originalEnv.OPENROUTER_API_KEY);
  restoreEnv("OPENROUTER_SITE_URL", originalEnv.OPENROUTER_SITE_URL);
  restoreEnv("OPENROUTER_TTS_MODEL", originalEnv.OPENROUTER_TTS_MODEL);
  restoreEnv("OPENROUTER_TTS_SPEED", originalEnv.OPENROUTER_TTS_SPEED);
  restoreEnv("OPENROUTER_TTS_VOICE", originalEnv.OPENROUTER_TTS_VOICE);
});

describe("synthesizeOpenRouterSpeech", () => {
  test("sends speech synthesis through OpenRouter with the configured model and voice", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(new Uint8Array([7, 8, 9]).buffer, {
        headers: { "Content-Type": "audio/mpeg" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { synthesizeOpenRouterSpeech } = await import("@/lib/openrouter-tts");

    const result = await synthesizeOpenRouterSpeech({
      locale: "ru",
      text: "Собери резюме голосом.",
    });

    expect(result.contentType).toBe("audio/mpeg");
    expect(Array.from(new Uint8Array(result.audio))).toEqual([7, 8, 9]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://openrouter.ai/api/v1/audio/speech",
    );

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    const body = JSON.parse(String(init.body)) as {
      input: string;
      model: string;
      provider: { options: { openai: { instructions: string } } };
      response_format: string;
      speed: number;
      voice: string;
    };

    expect(init.method).toBe("POST");
    expect(headers.Authorization).toBe("Bearer test-openrouter-key");
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["HTTP-Referer"]).toBe("https://offerlyra.test");
    expect(headers["X-OpenRouter-Title"]).toBe("OfferLyra");
    expect(body).toMatchObject({
      input: "Собери резюме голосом.",
      model: "openai/gpt-4o-mini-tts-2025-12-15",
      response_format: "mp3",
      speed: 0.92,
      voice: "marin",
    });
    expect(body.provider.options.openai.instructions).toContain("Russian");
    expect(body.provider.options.openai.instructions).toContain("moderately brisk");
  });

  test("limits the TTS input sent to OpenRouter", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(new ArrayBuffer(0)));
    vi.stubGlobal("fetch", fetchMock);

    const { synthesizeOpenRouterSpeech } = await import("@/lib/openrouter-tts");

    await synthesizeOpenRouterSpeech({
      locale: "en",
      text: "a".repeat(4100),
    });

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(init.body)) as { input: string };

    expect(body.input).toHaveLength(4096);
  });

  test("fails before calling OpenRouter when the API key is missing", async () => {
    delete process.env.OPENROUTER_API_KEY;

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { synthesizeOpenRouterSpeech, TextToSpeechUnavailableError } =
      await import("@/lib/openrouter-tts");

    await expect(
      synthesizeOpenRouterSpeech({ locale: "en", text: "Hello" }),
    ).rejects.toBeInstanceOf(TextToSpeechUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("surfaces OpenRouter error text for diagnostics", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Provider does not support this voice.", { status: 400 }),
      ),
    );

    const { synthesizeOpenRouterSpeech } = await import("@/lib/openrouter-tts");

    await expect(
      synthesizeOpenRouterSpeech({ locale: "en", text: "Hello" }),
    ).rejects.toThrow("Provider does not support this voice.");
  });
});

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}
