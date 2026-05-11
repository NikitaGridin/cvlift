"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Play,
  RotateCcw,
  Server,
  Target,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getTrainerQuestionCount,
  getTrainerQuestionPool,
  getTrainerQuestionSet,
  trainerGrades,
  trainerTopics,
  type TrainerGrade,
  type TrainerQuestion,
  type TrainerSpecialty,
  type TrainerTopic,
} from "@/lib/technical-interview-question-bank";
import {
  formatTrainerCreditCost,
  formatTrainerPointAmount,
  getTrainerAllQuestionsCreditCost,
  getTrainerTopicCreditCost,
} from "@/lib/trainer-test-access";

type TopicStatus = "not_started" | "passed" | "failed";

type TopicProgress = {
  status: TopicStatus;
  bestCorrect: number;
  bestPercent: number;
  bestPoints: number;
  attempts: number;
  updatedAt: string;
};

type ProgressMap = Record<string, TopicProgress>;

type ActiveTest = {
  topic: TrainerTopic;
  mode: "topic" | "all";
  specialty: TrainerSpecialty;
  grade: TrainerGrade;
  title: string;
  subtitle: string;
  creditCost: number;
  questions: TrainerQuestion[];
  currentIndex: number;
  answers: number[];
  selectedAnswer: number | null;
  confirmedAnswer: number | null;
};

type TestResult = {
  topic: TrainerTopic;
  mode: "topic" | "all";
  specialty: TrainerSpecialty;
  grade: TrainerGrade;
  title: string;
  subtitle: string;
  creditCost: number;
  correct: number;
  percent: number;
  points: number;
  status: "passed" | "failed";
  totalQuestions: number;
};

const STORAGE_KEY = "offerlyra:technical-interview-trainer:v1";
const PASS_PERCENT = 70;
const TEST_EXIT_WARNING = "Текущая попытка теста будет сброшена.";
const ALL_QUESTIONS_START_KEY = "all-topics-and-grades";
const ALL_QUESTIONS_TOPIC: TrainerTopic = {
  id: ALL_QUESTIONS_START_KEY,
  specialty: "frontend",
  title: "Все темы и грейды",
};

const specialtyOptions: Array<{
  id: TrainerSpecialty;
  title: string;
}> = [
  {
    id: "frontend",
    title: "Frontend Developer",
  },
  {
    id: "backend",
    title: "Backend Developer",
  },
];

const gradeLabels: Record<TrainerGrade, string> = {
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
};

const statusLabels: Record<TopicStatus, string> = {
  not_started: "not_started",
  passed: "passed",
  failed: "failed",
};

export function TechnicalInterviewTrainer({
  initialCreditsBalance,
  initialUnlockedTestReferences,
}: {
  initialCreditsBalance: number;
  initialUnlockedTestReferences: string[];
}) {
  const [specialty, setSpecialty] = useState<TrainerSpecialty>("frontend");
  const [grade, setGrade] = useState<TrainerGrade>("junior");
  const [progress, setProgress] = useState<ProgressMap>({});
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);
  const [testExitConfirmOpen, setTestExitConfirmOpen] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [creditsBalance, setCreditsBalance] = useState(initialCreditsBalance);
  const [unlockedTestReferences, setUnlockedTestReferences] = useState(
    () => new Set(initialUnlockedTestReferences),
  );
  const [startError, setStartError] = useState<string | null>(null);
  const [pendingStartKey, setPendingStartKey] = useState<string | null>(null);
  const progressLoadedRef = useRef(false);

  const topics = trainerTopics[specialty];
  const totalQuestionCount = getTrainerQuestionCount();
  const isTestOpen = activeTest !== null;
  const isAllQuestionsUnlocked = unlockedTestReferences.has(ALL_QUESTIONS_START_KEY);
  const allQuestionsCreditCost = isAllQuestionsUnlocked
    ? 0
    : getTrainerAllQuestionsCreditCost();
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      progressLoadedRef.current = true;
      setProgress(readStoredProgress());
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (!progressLoadedRef.current) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Progress is a convenience feature. The trainer remains usable without storage.
    }
  }, [progress]);

  useEffect(() => {
    if (!isTestOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = TEST_EXIT_WARNING;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setTestExitConfirmOpen(true);
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isTestOpen]);

  async function startTopic(
    topic: TrainerTopic,
    selectedSpecialty = specialty,
    selectedGrade = grade,
  ) {
    if (pendingStartKey !== null) {
      return;
    }

    const startKey = getTopicStartKey(selectedSpecialty, selectedGrade, topic.id);
    const questions = prepareQuestionsForTest(
      getTrainerQuestionSet(selectedSpecialty, selectedGrade, topic.id),
    );

    if (questions.length === 0) {
      setActiveTest(null);
      setResult(null);
      setStartError("В этом тесте пока нет вопросов.");
      return;
    }

    setStartError(null);
    setPendingStartKey(startKey);

    try {
      const startResponse = await authorizeTrainerTestStart({
        mode: "topic",
        specialty: selectedSpecialty,
        grade: selectedGrade,
        topicId: topic.id,
      });

      setCreditsBalance(startResponse.balance);
      if (startResponse.unlocked) {
        addUnlockedTestReference(startResponse.testReference);
      }
      setResult(null);
      setActiveTest({
        topic,
        mode: "topic",
        specialty: selectedSpecialty,
        grade: selectedGrade,
        title: topic.title,
        subtitle: `${getSpecialtyLabel(selectedSpecialty)} / ${gradeLabels[selectedGrade]}`,
        creditCost: startResponse.creditCost,
        questions,
        currentIndex: 0,
        answers: [],
        selectedAnswer: null,
        confirmedAnswer: null,
      });
    } catch (error) {
      setStartError(getTrainerStartErrorMessage(error));
    } finally {
      setPendingStartKey((current) => (current === startKey ? null : current));
    }
  }

  async function startAllQuestionsTest() {
    if (pendingStartKey !== null) {
      return;
    }

    const questions = prepareQuestionsForTest(
      shuffleQuestions(getTrainerQuestionPool()),
    );

    if (questions.length === 0) {
      setActiveTest(null);
      setResult(null);
      setStartError("В общем тесте пока нет вопросов.");
      return;
    }

    setStartError(null);
    setPendingStartKey(ALL_QUESTIONS_START_KEY);

    try {
      const startResponse = await authorizeTrainerTestStart({ mode: "all" });

      setCreditsBalance(startResponse.balance);
      if (startResponse.unlocked) {
        addUnlockedTestReference(startResponse.testReference);
      }
      setResult(null);
      setActiveTest({
        topic: ALL_QUESTIONS_TOPIC,
        mode: "all",
        specialty,
        grade,
        title: ALL_QUESTIONS_TOPIC.title,
        subtitle: "Все доступные вопросы",
        creditCost: startResponse.creditCost,
        questions,
        currentIndex: 0,
        answers: [],
        selectedAnswer: null,
        confirmedAnswer: null,
      });
    } catch (error) {
      setStartError(getTrainerStartErrorMessage(error));
    } finally {
      setPendingStartKey((current) =>
        current === ALL_QUESTIONS_START_KEY ? null : current,
      );
    }
  }

  function selectAnswer(answerIndex: number) {
    if (!activeTest || activeTest.confirmedAnswer !== null) {
      return;
    }

    setActiveTest({
      ...activeTest,
      selectedAnswer: answerIndex,
    });
  }

  function confirmAnswer() {
    if (!activeTest) {
      return;
    }

    if (activeTest.selectedAnswer === null) {
      return;
    }

    if (activeTest.confirmedAnswer === null) {
      setActiveTest({
        ...activeTest,
        confirmedAnswer: activeTest.selectedAnswer,
      });
      return;
    }

    const nextAnswers = [...activeTest.answers, activeTest.selectedAnswer];

    if (nextAnswers.length >= activeTest.questions.length) {
      finishTest(activeTest, nextAnswers);
      return;
    }

    setActiveTest({
      ...activeTest,
      currentIndex: activeTest.currentIndex + 1,
      answers: nextAnswers,
      selectedAnswer: null,
      confirmedAnswer: null,
    });
  }

  function finishTest(test: ActiveTest, answers: number[]) {
    if (test.questions.length === 0) {
      setActiveTest(null);
      return;
    }

    const correct = answers.reduce((sum, answer, index) => {
      return sum + (answer === test.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const percent = Math.round((correct / test.questions.length) * 100);
    const points = correct * 5;
    const status = percent >= PASS_PERCENT ? "passed" : "failed";
    const nextResult: TestResult = {
      topic: test.topic,
      mode: test.mode,
      specialty: test.specialty,
      grade: test.grade,
      title: test.title,
      subtitle: test.subtitle,
      creditCost: test.creditCost,
      correct,
      percent,
      points,
      status,
      totalQuestions: test.questions.length,
    };

    setActiveTest(null);
    setResult(nextResult);

    if (test.mode === "all") {
      return;
    }

    setProgress((current) => {
      const key = getProgressKey(test.specialty, test.grade, test.topic.id);
      const previous = current[key];
      const bestCorrect = Math.max(previous?.bestCorrect ?? 0, correct);
      const bestPercent = Math.max(previous?.bestPercent ?? 0, percent);
      const bestPoints = Math.max(previous?.bestPoints ?? 0, points);

      return {
        ...current,
        [key]: {
          status,
          bestCorrect,
          bestPercent,
          bestPoints,
          attempts: (previous?.attempts ?? 0) + 1,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  function requestCloseActiveTest() {
    setTestExitConfirmOpen(true);
  }

  function cancelCloseActiveTest() {
    setTestExitConfirmOpen(false);
  }

  function confirmCloseActiveTest() {
    setTestExitConfirmOpen(false);
    setActiveTest(null);
  }

  function closeResult() {
    setResult(null);
  }

  function addUnlockedTestReference(testReference: string) {
    if (!testReference) {
      return;
    }

    setUnlockedTestReferences((current) => {
      if (current.has(testReference)) {
        return current;
      }

      const next = new Set(current);
      next.add(testReference);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-9 items-center gap-2 rounded-full bg-[#0F172A] px-3 text-xs font-bold text-white">
              <Target aria-hidden="true" className="size-4 text-[#C9FF18]" />
              {totalQuestionCount} вопросов в тестах
            </span>
            <span className="inline-flex h-9 items-center rounded-full bg-[#ECFCCB] px-3 text-xs font-bold text-[#365314]">
              Баланс: {formatTrainerPointAmount(creditsBalance)}
            </span>
            <button
              type="button"
              onClick={startAllQuestionsTest}
              disabled={totalQuestionCount === 0 || pendingStartKey !== null}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#65A30D] px-3 text-xs font-bold text-white shadow-[0_14px_34px_rgba(101,163,13,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4D7C0F] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#CBD5E1] disabled:text-[#64748B] disabled:shadow-none"
            >
              <Play aria-hidden="true" className="size-4" />
              {pendingStartKey === ALL_QUESTIONS_START_KEY
                ? "Открываем..."
                : `Все темы и грейды · ${
                    isAllQuestionsUnlocked
                      ? "Открыто"
                      : formatTrainerCreditCost(allQuestionsCreditCost)
                  }`}
            </button>
          </div>
          <h2 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-[#0F172A]">
            Тренажер технических собеседований
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#64748B]">
            Сейчас заполнены все темы Frontend Developer для Junior, Middle и
            Senior. Backend-наборы останутся недоступны, пока в них не добавлены
            вопросы.
          </p>
          {startError ? (
            <p className="mt-4 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {startError}
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-[#6366F1]">Специальность</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {specialtyOptions.map((item) => {
              const active = item.id === specialty;
              const Icon = item.id === "frontend" ? Code2 : Server;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSpecialty(item.id);
                    setResult(null);
                    setActiveTest(null);
                    setStartError(null);
                  }}
                  className={`flex h-14 items-center gap-3 rounded-[16px] border px-3 text-left transition ${
                    active
                      ? "border-[#65A30D]/50 bg-[#ECFCCB] !text-black shadow-[0_14px_34px_rgba(101,163,13,0.16)]"
                      : "border-black/[0.06] bg-[#F8FAFC] hover:border-[#CBD5E1]"
                  }`}
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-[14px] ${
                      active
                        ? "bg-[#65A30D] text-white"
                        : "bg-white text-[#64748B]"
                    }`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span
                    className={`block text-sm font-bold ${active ? "!text-black" : "text-[#0F172A]"}`}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-[#6366F1]">Грейд</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {trainerGrades.map((item) => {
              const active = item === grade;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setGrade(item);
                    setResult(null);
                    setActiveTest(null);
                    setStartError(null);
                  }}
                  className={`h-14 rounded-[16px] border px-3 text-center text-sm font-bold transition ${
                    active
                      ? "border-[#65A30D]/50 bg-[#ECFCCB] !text-black shadow-[0_12px_28px_rgba(101,163,13,0.16)]"
                      : "border-black/[0.06] bg-[#F8FAFC] text-[#0F172A] hover:border-[#CBD5E1]"
                  }`}
                >
                  {gradeLabels[item]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-[#6366F1]">Темы</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
              {specialtyOptions.find((item) => item.id === specialty)?.title} -{" "}
              {gradeLabels[grade]}
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#64748B]">
            Passed threshold: {PASS_PERCENT}%
          </p>
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-2">
          {topics.map((topic, index) => {
            const record = progress[getProgressKey(specialty, grade, topic.id)];
            const status = record?.status ?? "not_started";
            const questionCount = getTrainerQuestionSet(specialty, grade, topic.id).length;
            const startKey = getTopicStartKey(specialty, grade, topic.id);
            const baseCreditCost = getTrainerTopicCreditCost(specialty, topic.id);
            const isUnlocked =
              baseCreditCost > 0 && unlockedTestReferences.has(startKey);
            const creditCost = isUnlocked ? 0 : baseCreditCost;

            return (
              <TopicRow
                key={topic.id}
                index={index}
                creditCost={creditCost}
                isUnlocked={isUnlocked}
                isStartDisabled={pendingStartKey !== null}
                isStarting={pendingStartKey === startKey}
                progress={questionCount === 0 ? undefined : record}
                status={questionCount === 0 ? "not_started" : status}
                topic={topic}
                questionCount={questionCount}
                onStart={() => startTopic(topic, specialty, grade)}
              />
            );
          })}
        </div>
      </section>

      {activeTest ? (
        <TestOverlay
          activeTest={activeTest}
          onConfirm={confirmAnswer}
          onClose={requestCloseActiveTest}
          onSelectAnswer={selectAnswer}
        />
      ) : null}

      {testExitConfirmOpen ? (
        <TestExitConfirmDialog
          onCancel={cancelCloseActiveTest}
          onConfirm={confirmCloseActiveTest}
        />
      ) : null}

      {result ? (
        <ResultOverlay
          onClose={closeResult}
          onRetry={() => {
            if (result.mode === "all") {
              startAllQuestionsTest();
              return;
            }

            startTopic(result.topic, result.specialty, result.grade);
          }}
          result={result}
        />
      ) : null}
    </div>
  );
}

function TestExitConfirmDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 px-4 text-[#0F172A] backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="trainer-exit-confirm-title"
        className="w-full max-w-md rounded-[24px] border border-black/[0.06] bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.32)]"
      >
        <h2
          id="trainer-exit-confirm-title"
          className="text-2xl font-bold tracking-tight text-[#0F172A]"
        >
          Выйти из теста?
        </h2>
        <p className="mt-3 text-sm font-medium leading-6 text-[#64748B]">
          Текущие ответы не сохранятся. {TEST_EXIT_WARNING}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[#65A30D] px-4 text-sm font-bold text-white shadow-[0_14px_34px_rgba(101,163,13,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4D7C0F]"
          >
            Продолжить
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[#0F172A] px-4 text-sm font-bold text-white transition hover:bg-[#1E293B]"
          >
            Выйти
          </button>
        </div>
      </section>
    </div>
  );
}

function TopicRow({
  creditCost,
  index,
  isStartDisabled,
  isStarting,
  isUnlocked,
  progress,
  questionCount,
  status,
  topic,
  onStart,
}: {
  creditCost: number;
  index: number;
  isStartDisabled: boolean;
  isStarting: boolean;
  isUnlocked: boolean;
  progress?: TopicProgress;
  questionCount: number;
  status: TopicStatus;
  topic: TrainerTopic;
  onStart: () => void;
}) {
  const tone = getStatusTone(status);
  const isEmpty = questionCount === 0;
  const visibleProgress = isEmpty ? undefined : progress;
  const Icon =
    status === "passed" ? CheckCircle2 : status === "failed" ? XCircle : Play;

  return (
    <article className="grid gap-4 rounded-[18px] border border-black/[0.06] bg-[#F8FAFC] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[14px] bg-white text-sm font-bold text-[#6366F1] shadow-sm">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-[#0F172A]">
              {topic.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
              {isEmpty || status === "not_started" ? null : (
                <span
                  className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 ${tone}`}
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                  {statusLabels[status]}
                </span>
              )}
              <span className="inline-flex h-7 items-center rounded-full bg-white px-2.5 text-[#475569]">
                Best: {visibleProgress?.bestCorrect ?? 0}/{questionCount}
              </span>
              <span className="inline-flex h-7 items-center rounded-full bg-white px-2.5 text-[#475569]">
                Points: {visibleProgress?.bestPoints ?? 0}
              </span>
              {!isEmpty ? (
                <span className="inline-flex h-7 items-center rounded-full bg-[#ECFCCB] px-2.5 text-[#365314]">
                  {isUnlocked ? "Открыто" : formatTrainerCreditCost(creditCost)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onStart}
        disabled={isEmpty || isStartDisabled}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1E293B] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#CBD5E1] disabled:text-[#64748B]"
      >
        {isEmpty || isStarting ? null : status === "not_started" ? (
          <Play aria-hidden="true" className="size-4" />
        ) : (
          <RotateCcw aria-hidden="true" className="size-4" />
        )}
        {isEmpty
          ? "Нет вопросов"
          : isStarting
            ? "Открываем..."
            : status === "not_started"
              ? "Открыть тест"
              : "Пройти снова"}
      </button>
    </article>
  );
}

function TestOverlay({
  activeTest,
  onConfirm,
  onClose,
  onSelectAnswer,
}: {
  activeTest: ActiveTest;
  onConfirm: () => void;
  onClose: () => void;
  onSelectAnswer: (answerIndex: number) => void;
}) {
  const question = activeTest.questions[activeTest.currentIndex];
  const isAnswerConfirmed = activeTest.confirmedAnswer !== null;
  const progressPercent = Math.round(
    (activeTest.currentIndex / activeTest.questions.length) * 100,
  );
  const isLastQuestion =
    activeTest.currentIndex === activeTest.questions.length - 1;
  const showNextQuestionIcon = isAnswerConfirmed && !isLastQuestion;

  return (
    <div className="fixed inset-0 z-50 flex min-h-0 flex-col bg-[#FAFBFC] text-[#0F172A]">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b border-black/[0.06] bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-10 items-center justify-center rounded-[14px] border border-[#6366F1]/20 bg-[#EEF2FF] text-[#4338CA] shadow-sm transition hover:bg-[#E0E7FF]"
          aria-label="Закрыть тест"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#6366F1]">
            {activeTest.subtitle}
          </p>
          <h2 className="truncate text-base font-bold sm:text-lg">
            {activeTest.title}
          </h2>
        </div>
        <div className="text-right text-sm font-bold tabular-nums text-[#64748B]">
          {activeTest.currentIndex + 1}/{activeTest.questions.length}
        </div>
      </header>

      <div className="h-1 bg-[#E2E8F0]">
        <div
          className="h-full bg-[#6366F1] transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <main className="grid min-h-0 flex-1 place-items-center overflow-hidden px-4 py-4 sm:py-6">
        <div className="w-full max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6366F1]">
            Вопрос {activeTest.currentIndex + 1}
          </p>
          <h1 className="mt-4 whitespace-pre-line text-2xl font-bold leading-tight text-[#0F172A] sm:text-4xl">
            {question.question}
          </h1>

          <div className="mt-8 grid gap-3">
            {question.answers.map((answer, index) => {
              const isSelected = activeTest.selectedAnswer === index;
              const isCorrect = question.correctAnswer === index;
              const isWrongConfirmed =
                isAnswerConfirmed && isSelected && !isCorrect;
              const answerClass = getAnswerButtonClass({
                isAnswerConfirmed,
                isCorrect,
                isSelected,
                isWrongConfirmed,
              });
              const markerClass = getAnswerMarkerClass({
                isAnswerConfirmed,
                isCorrect,
                isSelected,
                isWrongConfirmed,
              });

              return (
                <button
                  key={answer}
                  type="button"
                  onClick={() => onSelectAnswer(index)}
                  disabled={isAnswerConfirmed}
                  aria-pressed={isSelected}
                  className={`min-h-16 rounded-[18px] border px-5 py-4 text-left text-base font-semibold leading-6 shadow-sm transition ${answerClass}`}
                >
                  <span
                    className={`mr-3 inline-flex size-7 items-center justify-center rounded-full text-sm font-bold shadow-sm ${markerClass}`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  {answer}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onConfirm}
              disabled={activeTest.selectedAnswer === null}
              className="inline-flex h-12 min-w-44 items-center justify-center rounded-[16px] bg-[#6366F1] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(99,102,241,0.24)] transition hover:-translate-y-0.5 hover:bg-[#4F46E5] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#CBD5E1] disabled:text-[#64748B] disabled:shadow-none"
            >
              {isAnswerConfirmed
                ? isLastQuestion
                  ? "Завершить тест"
                  : "Следующий вопрос"
                : "Подтвердить ответ"}
              {showNextQuestionIcon ? (
                <ArrowRight aria-hidden="true" className="size-4" />
              ) : null}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function getAnswerButtonClass({
  isAnswerConfirmed,
  isCorrect,
  isSelected,
  isWrongConfirmed,
}: {
  isAnswerConfirmed: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  isWrongConfirmed: boolean;
}) {
  if (isAnswerConfirmed && isCorrect) {
    return "border-[#84CC16] bg-[#365314] !text-white shadow-[0_0_0_4px_rgba(132,204,22,0.2),0_0_38px_rgba(132,204,22,0.5),0_18px_42px_rgba(54,83,20,0.28)] disabled:cursor-default";
  }

  if (isWrongConfirmed) {
    return "border-[#F87171] bg-[#7F1D1D] !text-white shadow-[0_0_0_4px_rgba(248,113,113,0.2),0_0_34px_rgba(239,68,68,0.46),0_18px_42px_rgba(127,29,29,0.28)] disabled:cursor-default";
  }

  if (isAnswerConfirmed) {
    return "border-black/[0.06] bg-white text-[#64748B] opacity-70 disabled:cursor-default";
  }

  if (isSelected) {
    return "border-[#84CC16] bg-[#365314] !text-white shadow-[0_0_0_4px_rgba(132,204,22,0.18),0_0_34px_rgba(132,204,22,0.42),0_18px_42px_rgba(54,83,20,0.24)] hover:-translate-y-0.5";
  }

  return "border-black/[0.06] bg-white text-[#0F172A] hover:-translate-y-0.5 hover:border-[#6366F1]/35 hover:bg-[#EEF2FF]";
}

function getAnswerMarkerClass({
  isAnswerConfirmed,
  isCorrect,
  isSelected,
  isWrongConfirmed,
}: {
  isAnswerConfirmed: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  isWrongConfirmed: boolean;
}) {
  if (isAnswerConfirmed && isCorrect) {
    return "bg-[#84CC16] text-[#1A2E05]";
  }

  if (isWrongConfirmed) {
    return "bg-[#F87171] text-[#450A0A]";
  }

  if (isSelected) {
    return "bg-[#84CC16] text-[#1A2E05]";
  }

  return "bg-[#6366F1] text-white";
}

function ResultOverlay({
  onClose,
  onRetry,
  result,
}: {
  onClose: () => void;
  onRetry: () => void;
  result: TestResult;
}) {
  const passed = result.status === "passed";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 px-4 text-[#0F172A] backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-[24px] border border-white/20 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.38)]">
        <div className="flex items-start justify-between gap-4">
          <span
            className={`flex size-14 items-center justify-center rounded-[20px] ${
              passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {passed ? (
              <Trophy aria-hidden="true" className="size-7" />
            ) : (
              <XCircle aria-hidden="true" className="size-7" />
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-[14px] bg-[#F1F5F9] text-[#475569] transition hover:bg-[#E2E8F0]"
            aria-label="Закрыть результат"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-[#6366F1]">
          {result.subtitle} / {result.title}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          {passed ? "passed" : "failed"}
        </h2>
        <p className="mt-3 text-sm font-medium leading-6 text-[#64748B]">
          {result.mode === "all"
            ? "Результат не сохраняется. Это одноразовая проверка по всем вопросам."
            : "Результат сохранен в прогрессе темы. Лучший результат и баллы отображаются в списке тем."}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Metric
            label="Правильно"
            value={`${result.correct}/${result.totalQuestions}`}
            compact
          />
          <Metric label="Процент" value={`${result.percent}%`} compact />
          <Metric label="Баллы" value={result.points} compact />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[#65A30D] px-4 text-sm font-bold text-white shadow-[0_14px_34px_rgba(101,163,13,0.22)] transition hover:-translate-y-0.5 hover:bg-[#4D7C0F]"
          >
            К списку
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[#0F172A] px-4 text-sm font-bold text-white transition hover:bg-[#1E293B]"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Повторить
          </button>
        </div>
      </section>
    </div>
  );
}

function Metric({
  compact = false,
  label,
  value,
}: {
  compact?: boolean;
  label: string;
  value: number | string;
}) {
  return (
    <div
      className={`flex min-h-24 flex-col justify-center px-4 ${
        compact ? "rounded-[18px] bg-[#F8FAFC]" : ""
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
        {value}
      </p>
    </div>
  );
}

type TrainerStartPayload =
  | {
      mode: "topic";
      specialty: TrainerSpecialty;
      grade: TrainerGrade;
      topicId: string;
    }
  | { mode: "all" };

type TrainerStartResponse = {
  baseCreditCost: number;
  balance: number;
  charged: boolean;
  creditCost: number;
  questionCount: number;
  testReference: string;
  unlocked: boolean;
};

async function authorizeTrainerTestStart(
  payload: TrainerStartPayload,
): Promise<TrainerStartResponse> {
  const response = await fetch("/api/trainer/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data));
  }

  if (!isRecord(data) || typeof data.balance !== "number") {
    throw new Error("Не удалось открыть тест. Попробуйте позже.");
  }

  return {
    baseCreditCost:
      typeof data.baseCreditCost === "number" ? data.baseCreditCost : 0,
    balance: data.balance,
    charged: data.charged === true,
    creditCost:
      typeof data.creditCost === "number" ? data.creditCost : 0,
    questionCount:
      typeof data.questionCount === "number" ? data.questionCount : 0,
    testReference:
      typeof data.testReference === "string" ? data.testReference : "",
    unlocked: data.unlocked === true,
  };
}

function getApiErrorMessage(data: unknown) {
  if (isRecord(data) && typeof data.error === "string") {
    return data.error;
  }

  return "Не удалось открыть тест. Попробуйте позже.";
}

function getTrainerStartErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Не удалось открыть тест. Попробуйте позже.";
}

function getTopicStartKey(
  specialty: TrainerSpecialty,
  grade: TrainerGrade,
  topicId: string,
) {
  return `${specialty}:${grade}:${topicId}`;
}

function getProgressKey(
  specialty: TrainerSpecialty,
  grade: TrainerGrade,
  topicId: string,
) {
  return `${specialty}:${grade}:${topicId}`;
}

function readStoredProgress(): ProgressMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    return saved ? (JSON.parse(saved) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function shuffleQuestions(questions: TrainerQuestion[]) {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function prepareQuestionsForTest(questions: TrainerQuestion[]) {
  return questions.map((question) => shuffleQuestionAnswers(question));
}

function shuffleQuestionAnswers(question: TrainerQuestion): TrainerQuestion {
  const answersWithOriginalIndexes = question.answers.map((answer, index) => ({
    answer,
    index,
  }));

  for (let index = answersWithOriginalIndexes.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    [answersWithOriginalIndexes[index], answersWithOriginalIndexes[targetIndex]] = [
      answersWithOriginalIndexes[targetIndex],
      answersWithOriginalIndexes[index],
    ];
  }

  return {
    ...question,
    answers: answersWithOriginalIndexes.map((item) => item.answer),
    correctAnswer: answersWithOriginalIndexes.findIndex(
      (item) => item.index === question.correctAnswer,
    ),
  };
}

function getSpecialtyLabel(specialty: TrainerSpecialty) {
  return specialty === "frontend" ? "Frontend Developer" : "Backend Developer";
}

function getStatusTone(status: TopicStatus) {
  switch (status) {
    case "passed":
      return "bg-emerald-100 text-emerald-700";
    case "failed":
      return "bg-red-100 text-red-700";
    case "not_started":
      return "bg-slate-100 text-slate-600";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
