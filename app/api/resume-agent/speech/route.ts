import { z } from "zod";
import {
  synthesizeOpenRouterSpeech,
  TextToSpeechUnavailableError,
} from "@/lib/openrouter-tts";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";
import { getSessionSafely } from "@/lib/server-data";

export const runtime = "nodejs";
export const maxDuration = 60;

const speechRequestSchema = z.object({
  locale: z.enum(locales).optional(),
  text: z.string().trim().min(1).max(4096),
});

export async function POST(request: Request) {
  const session = await getSessionSafely();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Войдите, чтобы использовать качественную озвучку." },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный JSON в теле запроса." }, { status: 400 });
  }

  const parsed = speechRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Отправьте текст до 4096 символов." },
      { status: 400 },
    );
  }

  try {
    const result = await synthesizeOpenRouterSpeech({
      text: parsed.data.text,
      locale: (parsed.data.locale ?? defaultLocale) as Locale,
    });

    return new Response(result.audio, {
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const status =
      error instanceof TextToSpeechUnavailableError ? error.status : 500;

    return Response.json(
      { error: getSpeechErrorMessage(error) },
      { status },
    );
  }
}

function getSpeechErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "High-quality voice is temporarily unavailable.";
}
