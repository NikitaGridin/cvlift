import { z } from "zod";
import { InsufficientCreditsError, getWalletSummary } from "@/lib/credits";
import { getSessionSafely } from "@/lib/server-data";
import {
  getTrainerAllQuestionsCreditCost,
  getTrainerTopicCreditCost,
} from "@/lib/trainer-test-access";
import { chargeTrainerTestStart } from "@/lib/trainer-test-credits";
import {
  getTrainerQuestionPool,
  getTrainerQuestionSet,
  getTrainerTopic,
  trainerGrades,
  trainerSpecialties,
} from "@/lib/technical-interview-question-bank";

export const runtime = "nodejs";

const startRequestSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("topic"),
    specialty: z.enum(trainerSpecialties),
    grade: z.enum(trainerGrades),
    topicId: z.string().min(1),
  }),
  z.object({
    mode: z.literal("all"),
  }),
]);

type StartRequest = z.infer<typeof startRequestSchema>;

export async function POST(request: Request) {
  const session = await getSessionSafely();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Войдите, чтобы открыть тест." },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Некорректный JSON в теле запроса." },
      { status: 400 },
    );
  }

  const parsed = startRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Отправьте корректные параметры теста." },
      { status: 400 },
    );
  }

  const startConfig = getStartConfig(parsed.data);

  if (!startConfig.ok) {
    return Response.json({ error: startConfig.error }, { status: 400 });
  }

  try {
    const chargeResult = await chargeTrainerTestStart(
      session.user.id,
      startConfig.testReference,
      startConfig.creditCost,
    );
    const balance =
      chargeResult.wallet?.balance ?? (await getWalletSummary(session.user.id)).balance;

    return Response.json({
      ok: true,
      balance,
      baseCreditCost: startConfig.creditCost,
      charged: chargeResult.charged,
      creditCost: chargeResult.charged ? startConfig.creditCost : 0,
      questionCount: startConfig.questionCount,
      testReference: startConfig.testReference,
      unlocked: chargeResult.unlocked,
    });
  } catch (error) {
    return Response.json(
      { error: getStartErrorMessage(error) },
      { status: getStartErrorStatus(error) },
    );
  }
}

function getStartConfig(input: StartRequest) {
  if (input.mode === "all") {
    const questionCount = getTrainerQuestionPool().length;

    if (questionCount === 0) {
      return {
        ok: false as const,
        error: "В общем тесте пока нет вопросов.",
      };
    }

    return {
      ok: true as const,
      creditCost: getTrainerAllQuestionsCreditCost(),
      questionCount,
      testReference: "all-topics-and-grades",
    };
  }

  const topic = getTrainerTopic(input.specialty, input.topicId);

  if (!topic) {
    return {
      ok: false as const,
      error: "Тема не найдена.",
    };
  }

  const questionCount = getTrainerQuestionSet(
    input.specialty,
    input.grade,
    input.topicId,
  ).length;

  if (questionCount === 0) {
    return {
      ok: false as const,
      error: "В этом тесте пока нет вопросов.",
    };
  }

  return {
    ok: true as const,
    creditCost: getTrainerTopicCreditCost(input.specialty, input.topicId),
    questionCount,
    testReference: `${input.specialty}:${input.grade}:${input.topicId}`,
  };
}

function getStartErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Тест временно недоступен.";
}

function getStartErrorStatus(error: unknown) {
  if (error instanceof InsufficientCreditsError) {
    return error.status;
  }

  if (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return 500;
}
