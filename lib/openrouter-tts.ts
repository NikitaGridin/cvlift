import type { Locale } from "@/lib/i18n";
import { hasRealEnv } from "@/lib/env";

const OPENROUTER_TTS_API_URL = "https://openrouter.ai/api/v1/audio/speech";
const DEFAULT_TTS_MODEL =
  process.env.OPENROUTER_TTS_MODEL ?? "openai/gpt-4o-mini-tts-2025-12-15";
const DEFAULT_TTS_VOICE = process.env.OPENROUTER_TTS_VOICE ?? "marin";
const DEFAULT_TTS_SPEED = getTextToSpeechSpeed();
const MAX_TTS_INPUT_CHARS = 4096;

export class TextToSpeechUnavailableError extends Error {
  status = 503;

  constructor() {
    super("High-quality voice is not configured.");
    this.name = "TextToSpeechUnavailableError";
  }
}

export async function synthesizeOpenRouterSpeech(params: {
  text: string;
  locale: Locale;
}) {
  if (!hasRealEnv("OPENROUTER_API_KEY")) {
    throw new TextToSpeechUnavailableError();
  }

  const response = await fetch(OPENROUTER_TTS_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL ??
        process.env.AUTH_URL ??
        "http://localhost:3000",
      "X-OpenRouter-Title": "CVlift",
    },
    body: JSON.stringify({
      model: DEFAULT_TTS_MODEL,
      input: params.text.slice(0, MAX_TTS_INPUT_CHARS),
      voice: DEFAULT_TTS_VOICE,
      response_format: "mp3",
      speed: DEFAULT_TTS_SPEED,
      provider: {
        options: {
          openai: {
            instructions: buildVoiceInstructions(params.locale),
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `OpenRouter TTS request failed with ${response.status}.`,
    );
  }

  return {
    audio: await response.arrayBuffer(),
    contentType: response.headers.get("content-type") ?? "audio/mpeg",
  };
}

function buildVoiceInstructions(locale: Locale) {
  if (locale === "ru") {
    return [
      "Speak in natural, polished Russian.",
      "Sound like a calm senior career coach.",
      "Use warm but professional intonation.",
      "Speak at a natural, moderately brisk pace.",
      "Keep pauses brief and conversational.",
      "Keep articulation clean while maintaining momentum.",
      "Do not sound robotic, overly excited, or theatrical.",
    ].join(" ");
  }

  return [
    "Speak in natural, polished English.",
    "Sound like a calm senior career coach.",
    "Use warm but professional intonation.",
    "Speak at a natural, moderately brisk pace.",
    "Keep pauses brief and conversational.",
    "Keep articulation clean while maintaining momentum.",
    "Do not sound robotic, overly excited, or theatrical.",
  ].join(" ");
}

function getTextToSpeechSpeed() {
  const speed = Number.parseFloat(process.env.OPENROUTER_TTS_SPEED ?? "1.12");

  if (Number.isNaN(speed)) {
    return 1.12;
  }

  return Math.min(Math.max(speed, 0.25), 4);
}
