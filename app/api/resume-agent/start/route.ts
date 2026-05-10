import { z } from "zod";
import { InsufficientCreditsError } from "@/lib/credits";
import { chargeResumeAgentConversationStart } from "@/lib/resume-agent-credits";
import { getSessionSafely } from "@/lib/server-data";

export const runtime = "nodejs";

const startRequestSchema = z.object({
  conversationId: z.string().uuid(),
});

export async function POST(request: Request) {
  const session = await getSessionSafely();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Войдите, чтобы общаться с помощником по резюме." },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный JSON в теле запроса." }, { status: 400 });
  }

  const parsed = startRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Отправьте корректный id разговора." },
      { status: 400 },
    );
  }

  try {
    await chargeResumeAgentConversationStart(
      session.user.id,
      parsed.data.conversationId,
    );

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: getStartErrorMessage(error) },
      { status: getStartErrorStatus(error) },
    );
  }
}

function getStartErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Помощник по резюме временно недоступен.";
}

function getStartErrorStatus(error: unknown) {
  if (error instanceof InsufficientCreditsError) {
    return error.status;
  }

  if (error instanceof Error && "status" in error && typeof error.status === "number") {
    return error.status;
  }

  return 500;
}
