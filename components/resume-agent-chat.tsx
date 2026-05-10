"use client";

import {
  AudioWaveform,
  Bot,
  Download,
  Loader2,
  Maximize2,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/components/preferences-provider";

const VOICE_SILENCE_DELAY_MS = 2600;
const MAX_CLIENT_AGENT_MESSAGES = 12;
const MAX_COLLECTED_ANSWERS = 60;
const VISUALIZER_BARS = [
  8, 12, 18, 24, 32, 44, 62, 82, 58, 38, 86, 104, 78, 52, 70, 42, 28, 20,
  12, 8,
];

type AgentMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AgentResponseData = {
  error?: string;
  isFinal?: boolean;
  reply?: string;
};

type AgentStreamEvent =
  | {
      type: "meta";
      isFinal?: boolean;
    }
  | {
      type: "delta";
      content?: string;
    }
  | {
      type: "done";
    }
  | {
      type: "error";
      error?: string;
    };

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type SpeechRecognitionWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

type SpeechRecognitionResultLike = {
  0?: {
    transcript?: string;
  };
  isFinal?: boolean;
};

type SpeechRecognitionEventLike = Event & {
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
};

export function ResumeAgentChat() {
  const { locale, t } = useI18n();
  const [messages, setMessages] = useState<AgentMessage[]>(() => [
    {
      id: "intro",
      role: "assistant",
      content: t("agent.intro"),
    },
  ]);
  const [input, setInput] = useState("");
  const [voiceDraft, setVoiceDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [silencePending, setSilencePending] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [finalResumeText, setFinalResumeText] = useState("");
  const [finalResumeFileName, setFinalResumeFileName] = useState("");
  const [conversationComplete, setConversationComplete] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(() =>
    typeof window === "undefined" ? true : Boolean(getSpeechRecognitionConstructor()),
  );
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const messagesRef = useRef(messages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const conversationStartPromiseRef = useRef<Promise<void> | null>(null);
  const voiceDraftRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSendingRef = useRef(false);
  const shouldWarnBeforeExitRef = useRef(false);
  const allowExitRef = useRef(false);
  const pendingExitActionRef = useRef<(() => void) | null>(null);
  const skipSubmitOnEndRef = useRef(false);
  const voiceLoopActiveRef = useRef(false);
  const resumeListeningAfterSpeechRef = useRef(false);
  const hasVoiceIntroPlayedRef = useRef(false);
  const startListeningRef = useRef<() => void>(() => {});
  const activeSession = isListening || silencePending || isSending || isSpeaking;
  const hasUserMessages = messages.some((message) => message.role === "user");

  const lastAssistantMessage = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === "assistant") {
        return messages[index];
      }
    }

    return null;
  }, [messages]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isSendingRef.current = isSending;
  }, [isSending]);

  const requestExitConfirmation = useCallback((action: () => void) => {
    pendingExitActionRef.current = action;
    setExitConfirmOpen(true);
  }, []);

  useEffect(() => {
    shouldWarnBeforeExitRef.current =
      activeSession ||
      voiceLoopActiveRef.current ||
      voiceDraft.trim().length > 0 ||
      (hasUserMessages && !conversationComplete);
  }, [activeSession, conversationComplete, hasUserMessages, voiceDraft]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!shouldWarnBeforeExitRef.current || allowExitRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = t("agent.leave.browserWarning");
    }

    function handleDocumentClick(event: MouseEvent) {
      if (
        !shouldWarnBeforeExitRef.current ||
        allowExitRef.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (!anchor || anchor.closest("[data-agent-surface='true']")) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      if (anchor.download) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (
        nextUrl.href === currentUrl.href ||
        nextUrl.protocol === "mailto:" ||
        nextUrl.protocol === "tel:"
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      requestExitConfirmation(() => {
        window.location.assign(nextUrl.href);
      });
    }

    function handleDocumentSubmit(event: SubmitEvent) {
      if (
        !shouldWarnBeforeExitRef.current ||
        allowExitRef.current ||
        event.defaultPrevented
      ) {
        return;
      }

      const form = event.target;

      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (form.closest("[data-agent-surface='true']")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      requestExitConfirmation(() => {
        allowExitRef.current = true;
        form.requestSubmit();
      });
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);
    document.addEventListener("submit", handleDocumentSubmit, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
      document.removeEventListener("submit", handleDocumentSubmit, true);
    };
  }, [requestExitConfirmation, t]);

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (!activeSession) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeSession]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    setSilencePending(false);
  }, []);

  const updateVoiceDraft = useCallback((transcript: string) => {
    voiceDraftRef.current = transcript;
    setVoiceDraft(transcript);
    setInput(transcript);
  }, []);

  const stopSpeaking = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const resumeListeningAfterAssistant = useCallback(() => {
    if (!voiceLoopActiveRef.current || !resumeListeningAfterSpeechRef.current) {
      return;
    }

    resumeListeningAfterSpeechRef.current = false;

    window.setTimeout(() => {
      if (
        voiceLoopActiveRef.current &&
        !isSendingRef.current &&
        !recognitionRef.current
      ) {
        startListeningRef.current();
      }
    }, 350);
  }, []);

  const speakWithBrowserFallback = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) {
        setIsSpeaking(false);
        resumeListeningAfterAssistant();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ru-RU";
      utterance.rate = 1.12;
      utterance.pitch = 1;
      utterance.volume = 0.92;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resumeListeningAfterAssistant();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resumeListeningAfterAssistant();
      };

      window.speechSynthesis.speak(utterance);
    },
    [locale, resumeListeningAfterAssistant],
  );

  const speak = useCallback(
    async (text: string) => {
      stopSpeaking();
      setIsSpeaking(true);

      try {
        const response = await fetch("/api/resume-agent/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, text }),
        });

        if (!response.ok) {
          throw new Error("High-quality voice unavailable.");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audioRef.current = audio;
        audioUrlRef.current = audioUrl;
        audio.playbackRate = 1.08;
        audio.onended = () => {
          stopSpeaking();
          resumeListeningAfterAssistant();
        };
        audio.onerror = () => {
          stopSpeaking();
          speakWithBrowserFallback(text);
        };

        await audio.play();
      } catch {
        speakWithBrowserFallback(text);
      }
    },
    [locale, resumeListeningAfterAssistant, speakWithBrowserFallback, stopSpeaking],
  );

  const getConversationId = useCallback(() => {
    conversationIdRef.current ??= crypto.randomUUID();

    return conversationIdRef.current;
  }, []);

  const ensureConversationStarted = useCallback(async () => {
    if (conversationStartPromiseRef.current) {
      return conversationStartPromiseRef.current;
    }

    const conversationId = getConversationId();
    const startPromise = fetch("/api/resume-agent/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId }),
    }).then(async (response) => {
      const data = (await readAgentJsonResponse(response)) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? t("agent.error.unavailable"));
      }
    });

    conversationStartPromiseRef.current = startPromise;

    try {
      await startPromise;
    } catch (startError) {
      conversationStartPromiseRef.current = null;
      throw startError;
    }
  }, [getConversationId, t]);

  const sendMessage = useCallback(
    async (rawContent?: string, options?: { continueListening?: boolean }) => {
      const content = (rawContent ?? input).trim();

      if (!content || isSendingRef.current) {
        return;
      }

      try {
        await ensureConversationStarted();
      } catch (startError) {
        setError(
          startError instanceof Error && startError.message
            ? startError.message
            : t("agent.error.unavailable"),
        );
        resumeListeningAfterSpeechRef.current = false;
        return;
      }

      clearSilenceTimer();
      skipSubmitOnEndRef.current = true;
      recognitionRef.current?.stop();
      updateVoiceDraft("");
      resumeListeningAfterSpeechRef.current = Boolean(options?.continueListening);

      const userMessage: AgentMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };
      const nextMessages = [...messagesRef.current, userMessage];

      isSendingRef.current = true;
      messagesRef.current = nextMessages;
      setMessages(nextMessages);
      setInput("");
      setError(null);
      setIsSending(true);

      try {
        const assistantMessageId = crypto.randomUUID();
        const setStreamedReply = (reply: string) => {
          const nextReply = reply.trimStart();

          if (!nextReply) {
            return;
          }

          const assistantMessage: AgentMessage = {
            id: assistantMessageId,
            role: "assistant",
            content: nextReply,
          };
          const finalMessages = [...nextMessages, assistantMessage];

          messagesRef.current = finalMessages;
          setMessages(finalMessages);
        };
        const response = await fetch("/api/resume-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collectedAnswers: toCollectedAnswers(nextMessages),
            conversationId: getConversationId(),
            locale,
            messages: toAgentRequestMessages(nextMessages),
            stream: true,
          }),
        });
        const data = await readAgentResponse(response, setStreamedReply);

        if (!response.ok || !data.reply) {
          throw new Error(data.error ?? t("agent.error.unavailable"));
        }

        if (data.isFinal) {
          const fileName = getResumeTextFileName();

          voiceLoopActiveRef.current = false;
          resumeListeningAfterSpeechRef.current = false;
          setFinalResumeText(data.reply);
          setFinalResumeFileName(fileName);
          setConversationComplete(true);
          setIsChatOpen(true);
          downloadTextFile(data.reply, fileName);
        } else {
          resumeListeningAfterSpeechRef.current = Boolean(options?.continueListening);
        }

        setStreamedReply(data.reply);
        void speak(data.isFinal ? t("agent.finalVoiceSummary") : data.reply);
      } catch (sendError) {
        setError(
          sendError instanceof Error && sendError.message
            ? sendError.message
            : t("agent.error.unavailable"),
        );
        resumeListeningAfterSpeechRef.current = false;
      } finally {
        isSendingRef.current = false;
        setIsSending(false);
      }
    },
    [
      clearSilenceTimer,
      ensureConversationStarted,
      getConversationId,
      input,
      locale,
      speak,
      t,
      updateVoiceDraft,
    ],
  );

  const submitVoiceDraft = useCallback(() => {
    const content = voiceDraftRef.current.trim();

    clearSilenceTimer();

    if (!content || isSendingRef.current) {
      return;
    }

    updateVoiceDraft("");
    skipSubmitOnEndRef.current = true;
    recognitionRef.current?.stop();
    void sendMessage(content, { continueListening: voiceLoopActiveRef.current });
  }, [clearSilenceTimer, sendMessage, updateVoiceDraft]);

  const scheduleVoiceSubmit = useCallback(() => {
    if (!voiceDraftRef.current.trim()) {
      return;
    }

    clearSilenceTimer();
    setSilencePending(true);
    silenceTimerRef.current = setTimeout(
      submitVoiceDraft,
      VOICE_SILENCE_DELAY_MS,
    );
  }, [clearSilenceTimer, submitVoiceDraft]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending, isChatOpen]);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      recognitionRef.current?.abort();
      stopSpeaking();
    };
  }, [clearSilenceTimer, stopSpeaking]);

  async function startListening() {
    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setError(t("agent.error.voiceUnsupported"));
      return;
    }

    try {
      await ensureConversationStarted();
    } catch (startError) {
      setError(
        startError instanceof Error && startError.message
          ? startError.message
          : t("agent.error.unavailable"),
      );
      voiceLoopActiveRef.current = false;
      resumeListeningAfterSpeechRef.current = false;
      return;
    }

    voiceLoopActiveRef.current = true;
    clearSilenceTimer();
    stopSpeaking();
    recognitionRef.current?.abort();
    updateVoiceDraft("");
    setElapsedSeconds(0);
    setError(null);

    const isStartingVoiceInterview =
      !hasVoiceIntroPlayedRef.current &&
      !messagesRef.current.some((message) => message.role === "user");

    if (isStartingVoiceInterview) {
      hasVoiceIntroPlayedRef.current = true;
      resumeListeningAfterSpeechRef.current = true;
      void speak(t("agent.intro"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      setIsListening(false);

      if (skipSubmitOnEndRef.current) {
        skipSubmitOnEndRef.current = false;
        return;
      }

      if (voiceDraftRef.current.trim()) {
        scheduleVoiceSubmit();
      }
    };
    recognition.onerror = () => {
      setIsListening(false);
      clearSilenceTimer();
      setError(t("agent.error.voiceInput"));
    };
    recognition.onresult = (event) => {
      const transcript = getTranscript(event);

      if (transcript) {
        updateVoiceDraft(transcript);
        scheduleVoiceSubmit();
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setError(t("agent.error.voiceInput"));
    }
  }

  useEffect(() => {
    startListeningRef.current = startListening;
  });

  function pauseVoiceSession() {
    voiceLoopActiveRef.current = false;
    resumeListeningAfterSpeechRef.current = false;
    clearSilenceTimer();
    skipSubmitOnEndRef.current = true;
    recognitionRef.current?.stop();
    stopSpeaking();
    setIsListening(false);
    setSilencePending(false);
  }

  function cancelPendingExit() {
    pendingExitActionRef.current = null;
    setExitConfirmOpen(false);
  }

  function confirmPendingExit() {
    const action = pendingExitActionRef.current;

    pendingExitActionRef.current = null;
    allowExitRef.current = true;
    pauseVoiceSession();
    setExitConfirmOpen(false);
    action?.();
  }

  const fullscreenOverlay =
    isFullscreen && typeof document !== "undefined"
      ? createPortal(renderAgentShell(true), document.body)
      : null;
  const exitConfirmDialog =
    exitConfirmOpen && typeof document !== "undefined"
      ? createPortal(renderExitConfirmDialog(), document.body)
      : null;

  return (
    <>
      {renderAgentShell(false)}
      {fullscreenOverlay}
      {exitConfirmDialog}
    </>
  );

  function renderAgentShell(fullscreen: boolean) {
    const shellClassName = fullscreen
      ? "agent-voice-shell agent-voice-shell-fullscreen fixed inset-0 grid h-[100dvh] min-h-0 grid-rows-[72px_minmax(0,1fr)] gap-3 overflow-hidden rounded-none border-0 bg-[#020806] p-3 text-[#F4F8EF] shadow-none sm:p-4"
      : "agent-voice-shell grid h-[calc(100dvh-32px)] min-h-0 max-h-[calc(100dvh-32px)] grid-rows-[76px_minmax(0,1fr)] gap-3 overflow-hidden rounded-[24px] border border-[#C9FF18]/12 bg-[#020806] p-3 text-[#F4F8EF] shadow-[0_30px_120px_rgba(0,0,0,0.38)] lg:h-[calc(100dvh-64px)] lg:max-h-[calc(100dvh-64px)]";
    const contentClassName = fullscreen
      ? "grid min-h-0 gap-3"
      : "grid min-h-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.36fr)] 2xl:grid-cols-[minmax(0,1fr)_390px]";

    return (
      <section data-agent-surface="true" className={shellClassName}>
        <header className="agent-top-panel relative flex items-center justify-between gap-3 overflow-hidden rounded-[22px] border border-[#C9FF18]/12 bg-[#071007]/86 px-4 shadow-[0_20px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl xl:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#C9FF18]/12 text-[#C9FF18] shadow-[0_0_24px_rgba(201,255,24,0.18)]">
              <AudioWaveform aria-hidden="true" className="size-6" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold text-white xl:text-lg">
                <LocalizedAgentTitle />
              </span>
              <span className="mt-1 flex items-center gap-2 text-xs font-medium text-[#A4B09E]">
                <span className="size-2 rounded-full bg-[#C9FF18] shadow-[0_0_12px_rgba(201,255,24,0.62)]" />
                <span>{t("agent.status.online")}</span>
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-[14px] bg-white/[0.04] text-[#DDE8D7] transition duration-200 hover:bg-white/[0.08]"
              aria-label={
                fullscreen
                  ? t("agent.action.closeFullscreen")
                  : t("agent.action.openFullscreen")
              }
              onClick={() => {
                if (fullscreen) {
                  setIsFullscreen(false);
                  return;
                }

                setIsChatOpen(false);
                setIsFullscreen(true);
              }}
            >
              {fullscreen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Maximize2 aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </header>

        <div className={contentClassName}>
          <div className="agent-call-panel relative flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#C9FF18]/12 bg-[#050E05]/82 shadow-[0_26px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
            {!fullscreen ? (
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="absolute right-4 top-4 z-20 inline-flex size-11 items-center justify-center rounded-full border border-[#C9FF18]/12 bg-white/[0.05] text-[#F2FFD0] shadow-sm transition duration-200 hover:bg-white/[0.08] lg:hidden"
                aria-label={t("agent.action.openChat")}
              >
                <MessageCircle aria-hidden="true" className="size-5" />
              </button>
            ) : null}

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-3 text-center sm:px-6">
              <VoiceVisualizer
                active={activeSession}
                tone={isListening ? "listening" : isSpeaking ? "speaking" : "idle"}
              />

              <p className="mt-2 text-lg font-bold tracking-tight text-[#C9FF18] drop-shadow-[0_0_18px_rgba(201,255,24,0.34)] xl:text-xl">
                {getCallStatusLabel()}
                {activeSession ? "..." : ""}
              </p>
              <p className="mt-1 text-lg font-medium tabular-nums text-[#F0F5EC]/90 xl:text-xl">
                {formatElapsedTime(elapsedSeconds)}
              </p>

              <div className="mt-2 min-h-6 max-w-xl px-4">
                <p className="line-clamp-2 text-xs font-medium leading-5 text-[#A9C8B5] xl:text-sm">
                  {voiceDraft || lastAssistantMessage?.content || t("agent.intro")}
                </p>
              </div>

              {error ? (
                <div className="mt-5 max-w-2xl rounded-2xl border border-[#F87171]/20 bg-[#7F1D1D]/25 px-4 py-3 text-sm font-semibold text-[#FCA5A5]">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="flex justify-center px-5 pb-5 sm:px-8">
              <VoiceControlButton
                featured
                icon={
                  activeSession ? (
                    <Pause aria-hidden="true" className="size-5" />
                  ) : (
                    <Play aria-hidden="true" className="size-5" />
                  )
                }
                label={activeSession ? t("agent.call.pause") : t("agent.call.start")}
                onClick={activeSession ? pauseVoiceSession : startListening}
                disabled={!voiceSupported || isSending}
              />
            </div>
          </div>

          {!fullscreen ? (
            <aside
              className={`agent-chat-panel ${
                isChatOpen ? "fixed inset-3 z-40 flex" : "hidden"
              } relative min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#C9FF18]/12 bg-[#050E05]/88 shadow-[0_26px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl lg:static lg:inset-auto lg:z-auto lg:flex`}
            >
            <div className="flex items-center justify-between gap-3 border-b border-[#C9FF18]/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <AudioWaveform aria-hidden="true" className="size-5 text-[#C9FF18]" />
                <h2 className="text-base font-bold text-[#F0FFF5] xl:text-lg">
                  {t("agent.chat.title")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-full text-[#94A99C] transition duration-200 hover:bg-white/[0.06] hover:text-white lg:hidden"
                aria-label={t("agent.action.closeChat")}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
              <MoreHorizontal
                aria-hidden="true"
                className="hidden size-5 text-[#94A99C] lg:block"
              />
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <article
                  key={message.id}
                  className={`rounded-[16px] border px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.16)] ${
                    message.role === "user"
                      ? "ml-5 border-[#C9FF18]/20 bg-[#253B05]/82"
                      : "mr-4 border-[#C9FF18]/10 bg-[#091407]/86"
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#39F878]">
                    {message.role === "assistant" ? (
                      <Bot aria-hidden="true" className="size-4" />
                    ) : (
                      <UserRound aria-hidden="true" className="size-4" />
                    )}
                    {message.role === "assistant"
                      ? t("agent.chat.aiAgent")
                      : t("agent.chat.you")}
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-[#DCEBE2]">
                    {message.content}
                  </p>
                  <p className="mt-1.5 text-right text-[11px] font-medium text-[#8CA092]">
                    {formatMessageTime(index)}
                  </p>
                </article>
              ))}

              {finalResumeText ? (
                <div className="rounded-[16px] border border-[#C9FF18]/18 bg-[#172305]/90 p-4 shadow-[0_14px_46px_rgba(0,0,0,0.22)]">
                  <p className="text-sm font-bold text-[#C9FF18]">
                    {t("agent.finalDownload.title")}
                  </p>
                  <p className="mt-1 text-xs font-medium leading-5 text-[#A9C8B5]">
                    {t("agent.finalDownload.text")}
                  </p>
                  <button
                    type="button"
                    onClick={() => downloadTextFile(finalResumeText, finalResumeFileName)}
                    className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-[#C9FF18] px-4 text-sm font-bold text-[#061006] shadow-[0_0_26px_rgba(201,255,24,0.24)] transition duration-200 hover:bg-[#D8FF3B]"
                  >
                    <Download aria-hidden="true" className="size-4" />
                    {t("agent.finalDownload.button")}
                  </button>
                </div>
              ) : null}

              {isSending ? (
                <div className="flex items-center gap-3 rounded-[16px] border border-[#6AFF9B]/8 bg-[#071A16]/82 px-4 py-3 text-xs font-bold text-[#A9C8B5]">
                  <Loader2
                    aria-hidden="true"
                    className="size-4 animate-spin text-[#39F878]"
                  />
                  {t("agent.status.thinking")}
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
              className="border-t border-[#C9FF18]/10 p-3"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t("agent.input.placeholder")}
                  rows={1}
                  className="min-h-11 resize-none rounded-[13px] border border-[#C9FF18]/14 bg-[#030903]/86 px-3.5 py-2.5 text-sm font-medium leading-5 text-[#F4F8EF] outline-none transition duration-200 placeholder:text-[#7D8B74] focus:border-[#C9FF18]/45 focus:ring-4 focus:ring-[#C9FF18]/10"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="inline-flex size-11 items-center justify-center rounded-[13px] bg-[#6EA000] text-white shadow-[0_0_26px_rgba(201,255,24,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8CCB00] disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label={t("agent.action.send")}
                >
                  <Send aria-hidden="true" className="size-5" />
                </button>
              </div>
            </form>
            </aside>
          ) : null}
        </div>
      </section>
    );
  }

  function renderExitConfirmDialog() {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/62 px-4 text-[#F4F8EF] backdrop-blur-md"
        style={{ zIndex: 2147483647 }}
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="agent-exit-confirm-title"
          className="w-full max-w-md rounded-[24px] border border-[#C9FF18]/18 bg-[#061006] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
        >
          <h2
            id="agent-exit-confirm-title"
            className="text-xl font-bold tracking-tight text-white"
          >
            {t("agent.leave.title")}
          </h2>
          <p className="mt-3 text-sm font-medium leading-6 text-[#A9C8B5]">
            {t("agent.leave.text")}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={cancelPendingExit}
              className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#C9FF18]/14 bg-white/[0.04] px-4 text-sm font-bold text-[#F4F8EF] transition duration-200 hover:bg-white/[0.08]"
            >
              {t("agent.leave.stay")}
            </button>
            <button
              type="button"
              onClick={confirmPendingExit}
              className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#C9FF18] px-4 text-sm font-bold text-[#061006] shadow-[0_0_28px_rgba(201,255,24,0.28)] transition duration-200 hover:bg-[#D8FF3B]"
            >
              {t("agent.leave.confirm")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function getSessionStateLabel() {
    if (!voiceSupported) {
      return t("agent.status.voiceUnsupported");
    }

    if (silencePending) {
      return t("agent.status.waiting");
    }

    if (isListening) {
      return t("agent.status.listening");
    }

    if (isSending) {
      return t("agent.status.thinking");
    }

    if (isSpeaking) {
      return t("agent.status.speaking");
    }

    return t("agent.status.ready");
  }

  function getCallStatusLabel() {
    if (isListening || silencePending) {
      return t("agent.call.listeningToYou");
    }

    return getSessionStateLabel();
  }
}

function LocalizedAgentTitle() {
  const { t } = useI18n();
  return <>{t("agent.voice.title")}</>;
}

function VoiceVisualizer({
  active,
  tone,
}: {
  active: boolean;
  tone: "idle" | "listening" | "speaking";
}) {
  return (
    <div className="agent-orb-wrap">
      <div className={`agent-orb-field ${active ? "agent-orb-field-active" : ""}`} />
      <div
        className={`agent-orb ${
          tone === "speaking" ? "agent-orb-speaking" : ""
        } ${active ? "agent-orb-active" : ""}`}
      >
        <div className="agent-waveform" aria-hidden="true">
          {VISUALIZER_BARS.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="agent-waveform-bar"
              style={{
                animationDelay: `${index * -72}ms`,
                height,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function VoiceControlButton({
  disabled,
  featured = false,
  icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  featured?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex min-w-0 flex-col items-center gap-1.5 text-center text-xs font-semibold text-[#9CAFA3] transition duration-200 disabled:cursor-not-allowed disabled:opacity-45"
    >
      <span
        className={`flex size-12 items-center justify-center rounded-full transition duration-200 xl:size-[54px] ${
          featured
            ? "bg-[#C9FF18] text-[#061006] shadow-[0_0_28px_rgba(201,255,24,0.36)] group-hover:bg-[#D8FF3B]"
            : "bg-white/[0.06] text-[#D7E9DE] group-hover:bg-white/[0.1] group-hover:text-white"
        }`}
      >
        {icon}
      </span>
      <span className={featured ? "text-[#E8FFF2]" : ""}>{label}</span>
    </button>
  );
}

function toAgentRequestMessages(messages: AgentMessage[]) {
  return messages
    .slice(-MAX_CLIENT_AGENT_MESSAGES)
    .map(({ role, content }) => ({
      role,
      content: content.trim(),
    }))
    .filter((message) => message.content.length > 0);
}

function toCollectedAnswers(messages: AgentMessage[]) {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim())
    .filter((content) => content.length > 0)
    .slice(-MAX_COLLECTED_ANSWERS);
}

function getResumeTextFileName() {
  const date = new Date().toISOString().slice(0, 10);

  return `offerlyra-resume-${date}.txt`;
}

function downloadTextFile(text: string, fileName: string) {
  if (typeof document === "undefined") {
    return;
  }

  const blob = new Blob(["\ufeff", text], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName || getResumeTextFileName();
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function readAgentResponse(
  response: Response,
  onDelta: (reply: string) => void,
): Promise<AgentResponseData> {
  const contentType = response.headers.get("content-type") ?? "";

  if (
    response.ok &&
    response.body &&
    contentType.includes("application/x-ndjson")
  ) {
    return readAgentStreamResponse(response.body, onDelta);
  }

  return readAgentJsonResponse(response);
}

async function readAgentJsonResponse(response: Response): Promise<AgentResponseData> {
  try {
    return (await response.json()) as AgentResponseData;
  } catch {
    return { error: "Invalid agent response." } satisfies AgentResponseData;
  }
}

async function readAgentStreamResponse(
  body: ReadableStream<Uint8Array>,
  onDelta: (reply: string) => void,
): Promise<AgentResponseData> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let reply = "";
  let isFinal = false;

  const handleLine = (line: string) => {
    const event = parseAgentStreamEvent(line);

    if (!event) {
      return;
    }

    if (event.type === "meta") {
      isFinal = Boolean(event.isFinal);
      return;
    }

    if (event.type === "delta" && event.content) {
      reply += event.content;
      onDelta(reply);
      return;
    }

    if (event.type === "error") {
      throw new Error(event.error ?? "Agent stream failed.");
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        handleLine(line);
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      handleLine(buffer);
    }
  } finally {
    reader.releaseLock();
  }

  return { isFinal, reply } satisfies AgentResponseData;
}

function parseAgentStreamEvent(line: string) {
  const trimmed = line.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as AgentStreamEvent;
  } catch {
    return null;
  }
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as SpeechRecognitionWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function getTranscript(event: SpeechRecognitionEventLike) {
  const transcriptParts: string[] = [];

  for (let index = 0; index < event.results.length; index += 1) {
    const transcript = event.results[index][0]?.transcript?.trim();

    if (transcript) {
      transcriptParts.push(transcript);
    }
  }

  return transcriptParts.join(" ").trim();
}

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function formatMessageTime(index: number) {
  const hour = 10 + Math.floor(index / 3);
  const minute = 30 + (index % 3);

  return `${hour}:${minute.toString().padStart(2, "0")}`;
}
