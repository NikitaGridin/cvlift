import { z } from "zod";
import {
  InsufficientCreditsError,
} from "@/lib/credits";
import {
  chatWithResumeAgent,
  streamWithResumeAgent,
  type ResumeAgentMessage,
} from "@/lib/openrouter-resume-agent";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";
import {
  ResumeAgentCreditsUnavailableError,
  chargeResumeAgentConversationStart,
} from "@/lib/resume-agent-credits";
import { getSessionSafely } from "@/lib/server-data";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_REQUEST_MESSAGES = 80;
const MAX_INTERVIEW_CONTEXT_MESSAGES = 10;
const MAX_FINAL_CONTEXT_MESSAGES = 18;
const MAX_COLLECTED_ANSWERS = 80;
const MIN_AUTOFINAL_ANSWERS = 6;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

const requestSchema = z.object({
  collectedAnswers: z.array(z.string().trim().min(1).max(4000)).max(MAX_COLLECTED_ANSWERS).optional(),
  conversationId: z.string().uuid(),
  locale: z.enum(locales).optional(),
  messages: z.array(messageSchema).min(1).max(MAX_REQUEST_MESSAGES),
  stream: z.boolean().optional(),
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

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Отправьте сообщения чата с ролью и текстом." },
      { status: 400 },
    );
  }

  try {
    const collectedAnswers = getCollectedAnswers(
      parsed.data.collectedAnswers,
      parsed.data.messages as ResumeAgentMessage[],
    );
    const shouldProduceResume = shouldProduceFinalResume(
      collectedAnswers,
      parsed.data.messages as ResumeAgentMessage[],
    );
    const shouldChargeConversationStart = shouldChargeResumeAgentConversationStart(
      parsed.data.messages as ResumeAgentMessage[],
    );

    if (shouldChargeConversationStart) {
      await chargeResumeAgentConversationStart(
        session.user.id,
        parsed.data.conversationId,
      );
    }

    const contextLimit = shouldProduceResume
      ? MAX_FINAL_CONTEXT_MESSAGES
      : MAX_INTERVIEW_CONTEXT_MESSAGES;
    const agentParams = {
      collectedAnswers,
      messages: parsed.data.messages.slice(-contextLimit) as ResumeAgentMessage[],
      locale: (parsed.data.locale ?? defaultLocale) as Locale,
      shouldProduceResume,
      userId: session.user.id,
    };

    if (parsed.data.stream) {
      const result = await streamWithResumeAgent(agentParams);

      return createAgentStreamResponse(result);
    }

    const result = await chatWithResumeAgent(agentParams);

    return Response.json({ isFinal: result.isFinal, reply: result.reply });
  } catch (error) {
    return Response.json(
      { error: getAgentErrorMessage(error) },
      { status: getAgentErrorStatus(error) },
    );
  }
}

function createAgentStreamResponse(result: {
  isFinal: boolean;
  deltas: AsyncIterable<string>;
}) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      write({ type: "meta", isFinal: result.isFinal });

      try {
        for await (const delta of result.deltas) {
          write({ type: "delta", content: delta });
        }

        write({ type: "done" });
      } catch (error) {
        write({ type: "error", error: getAgentErrorMessage(error) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-store, no-transform",
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}

function getCollectedAnswers(
  collectedAnswers: string[] | undefined,
  messages: ResumeAgentMessage[],
) {
  const answers =
    collectedAnswers?.length
      ? collectedAnswers
      : messages
          .filter((message) => message.role === "user")
          .map((message) => message.content);

  return answers
    .map((answer) => answer.trim())
    .filter((answer) => answer.length > 0)
    .slice(-MAX_COLLECTED_ANSWERS);
}

function shouldProduceFinalResume(
  collectedAnswers: string[],
  messages: ResumeAgentMessage[],
) {
  const latestUserMessage =
    [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const answerBank = collectedAnswers.join("\n").toLowerCase();

  if (hasExplicitFinalResumeIntent(latestUserMessage)) {
    return true;
  }

  return (
    collectedAnswers.length >= MIN_AUTOFINAL_ANSWERS &&
    hasSearchCriteria(answerBank) &&
    hasCompanyExperience(answerBank) &&
    hasPersonalSection(answerBank)
  );
}

function shouldChargeResumeAgentConversationStart(messages: ResumeAgentMessage[]) {
  return messages.filter((message) => message.role === "user").length === 1;
}

function hasExplicitFinalResumeIntent(message: string) {
  return (
    /(готово|финал|finish|done)/i.test(message) ||
    /(составь|создай|собери|сгенерируй|подготовь|напиши).{0,32}(резюме|resume)/i.test(
      message,
    ) ||
    /(generate|create|build|write|prepare).{0,32}(resume|cv|draft)/i.test(
      message,
    )
  );
}

function hasSearchCriteria(answerBank: string) {
  return (
    /(где ищ|ищу|локац|город|страна|удален|офис|гибрид|релокац|remote|hybrid|office|relocat|location|city|country)/i.test(
      answerBank,
    ) &&
    /(ваканс|позици|должност|роль|role|position|vacancy|frontend|backend|developer|engineer|designer|manager|аналитик|разработ)/i.test(
      answerBank,
    ) &&
    /(доход|зарплат|компенсац|salary|income|compensation|руб|₽|usd|eur|\$|тыс)/i.test(
      answerBank,
    )
  );
}

function hasCompanyExperience(answerBank: string) {
  return (
    /(компан|работал|работала|работаю|работы|работа|employer|company|worked|work at|experience|ооо|inc|ltd|llc)/i.test(
      answerBank,
    ) &&
    /(обязан|достижен|задач|проект|метрик|стек|команд|влияни|разработ|внедр|responsib|achiev|project|metric|stack|team|impact|built|led|improved|reduced|delivered)/i.test(
      answerBank,
    )
  );
}

function hasPersonalSection(answerBank: string) {
  return (
    /(email|почт|@|телефон|phone|telegram|телеграм|linkedin|github|портфолио|portfolio|ссылк|link)/i.test(
      answerBank,
    ) &&
    /(образован|университет|вуз|бакалавр|магистр|курс|сертифик|язык|education|university|degree|bachelor|master|course|certif|language)/i.test(
      answerBank,
    )
  );
}

function getAgentErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Помощник по резюме временно недоступен.";
}

function getAgentErrorStatus(error: unknown) {
  if (error instanceof InsufficientCreditsError) {
    return error.status;
  }

  if (error instanceof ResumeAgentCreditsUnavailableError) {
    return error.status;
  }

  return 500;
}
