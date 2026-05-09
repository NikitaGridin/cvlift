"use client";

import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, motion, useInView } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  ChartNoAxesCombined,
  FileWarning,
  KeyRound,
  ListChecks,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LocalizedString } from "@/components/localized-text";
import type { LocalizedValue } from "@/lib/i18n";

type HomeRoiSectionsProps = {
  isSignedIn: boolean;
};

type RejectionReason = {
  label: LocalizedValue<string>;
  description: LocalizedValue<string>;
  value: number;
  color: string;
  icon: LucideIcon;
};

const l = (en: string, ru: string): LocalizedValue<string> => ({ en, ru });

const interviewData = [
  { week: "W1", before: 8, after: 9 },
  { week: "W2", before: 9, after: 13 },
  { week: "W3", before: 8, after: 18 },
  { week: "W4", before: 10, after: 26 },
  { week: "W5", before: 9, after: 34 },
  { week: "W6", before: 8, after: 42 },
  { week: "W7", before: 9, after: 49 },
  { week: "W8", before: 10, after: 54 },
];

const kpis = [
  {
    prefix: "+",
    value: 43,
    suffix: "%",
    label: "Interview Rate",
    detail: l(
      "More qualified interview invitations",
      "Больше релевантных приглашений",
    ),
  },
  {
    prefix: "+",
    value: 61,
    suffix: "",
    label: "ATS Score",
    detail: l(
      "Cleaner parsing and stronger matching",
      "Чище парсинг и сильнее совпадение",
    ),
  },
  {
    prefix: "",
    value: 2.3,
    suffix: "x",
    label: "Recruiter Responses",
    detail: l(
      "Higher response density per application",
      "Больше ответов на каждый отклик",
    ),
    decimals: 1,
  },
];

const rejectionReasons: RejectionReason[] = [
  {
    label: l("Missing required keywords", "Нет нужных ключевых слов"),
    description: l(
      "Missing relevant keywords lowers the chance of passing ATS and catching recruiter attention.",
      "Отсутствие релевантных ключевых слов снижает шансы на прохождение ATS и привлечение внимания рекрутера.",
    ),
    value: 32,
    color: "#ef4444",
    icon: KeyRound,
  },
  {
    label: l("Weak structure", "Слабая структура"),
    description: l(
      "Disorganized or overloaded structure makes key information harder to read.",
      "Неорганизованная или перегруженная структура затрудняет восприятие ключевой информации.",
    ),
    value: 24,
    color: "#f59e0b",
    icon: ListChecks,
  },
  {
    label: l("Experience without outcomes", "Опыт описан без результата"),
    description: l(
      "Focusing on responsibilities instead of achievements hides your value for the company.",
      "Фокус на обязанностях, а не на достижениях, не показывает вашу ценность для компании.",
    ),
    value: 18,
    color: "#8b5cf6",
    icon: ChartNoAxesCombined,
  },
  {
    label: l("Not adapted to the vacancy", "Не адаптировано под вакансию"),
    description: l(
      "A generic resume feels less relevant for a specific role and employer.",
      "Отсутствие адаптации под конкретную позицию снижает релевантность резюме.",
    ),
    value: 14,
    color: "#14b8a6",
    icon: Target,
  },
  {
    label: l("ATS reading issues", "Проблемы с ATS-чтением"),
    description: l(
      "Formatting errors, tables, columns, and unusual fonts can break automated resume parsing.",
      "Ошибки форматирования, таблицы, колонки и нестандартные шрифты мешают корректному чтению резюме системами.",
    ),
    value: 12,
    color: "#a8ff00",
    icon: FileWarning,
  },
];

const leftReasonIndexes = [4, 3, 2];
const rightReasonIndexes = [0, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};
const chartTone = {
  grid: "rgba(255,255,255,0.09)",
  tick: "#92988E",
  tooltipBg: "rgba(9, 12, 8, 0.9)",
  tooltipColor: "#F4F7F0",
};

export function HomeRoiSections({ isSignedIn }: HomeRoiSectionsProps) {
  return (
    <>
      <InterviewGrowthSection isSignedIn={isSignedIn} />
      <RejectionReasonsSection />
    </>
  );
}

function InterviewGrowthSection({ isSignedIn }: HomeRoiSectionsProps) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <motion.section
      ref={ref}
      id="interview-growth"
      className="cvlift-roi-section cvlift-roi-growth border-b border-white/8"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid w-full max-w-[1320px] gap-7 px-4 py-20 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-28">
        <div className="cvlift-roi-copy">
          <p className="cvlift-roi-eyebrow">
            <TrendingUp aria-hidden="true" className="size-4" />
            measurable_resume_growth
          </p>
          <h2 className="cvlift-section-title mt-6 text-white">
            <LocalizedString
              value={l(
                "More invitations. Fewer rejections.",
                "Больше приглашений. Меньше отказов.",
              )}
            />
          </h2>
          <p className="mt-5 max-w-xl font-mono text-sm font-medium leading-7 text-[#92988E]">
            <LocalizedString
              value={l(
                "CVlift analyzes resumes, optimizes for ATS, and helps candidates pass recruiter filters.",
                "CVlift анализирует резюме, оптимизирует под ATS и помогает проходить фильтры рекрутеров.",
              )}
            />
          </p>
          <div className="mt-8">
            <Link href="/upload" className="cvlift-primary-button">
              <LocalizedString
                value={
                  isSignedIn
                    ? l("Improve resume", "Улучшить резюме")
                    : l("Start analysis", "Запустить анализ")
                }
              />
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <motion.div
            className="cvlift-roi-card cvlift-chart-card"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="font-mono text-[11px] font-black uppercase text-[#B7FF00]">
                  interview_rate_%
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  <LocalizedString
                    value={l(
                      "Weekly conversion trend",
                      "Динамика конверсии по неделям",
                    )}
                  />
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-[11px] font-black">
                <span className="cvlift-chart-legend cvlift-chart-legend-before">
                  Before CVlift
                </span>
                <span className="cvlift-chart-legend cvlift-chart-legend-after">
                  After CVlift
                </span>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={interviewData}
                  margin={{ top: 10, right: 16, left: -18, bottom: 4 }}
                >
                  <defs>
                    <linearGradient
                      id="cvliftInterviewGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#a8ff00" />
                      <stop offset="54%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartTone.grid} vertical={false} />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: chartTone.tick,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 60]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{
                      fill: chartTone.tick,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  />
                  <Tooltip
                    cursor={{ stroke: "rgba(20,184,166,0.34)", strokeWidth: 1 }}
                    contentStyle={{
                      border: "1px solid rgba(20,184,166,0.24)",
                      borderRadius: "16px",
                      background: chartTone.tooltipBg,
                      boxShadow: "0 18px 48px rgba(0,0,0,0.18)",
                      color: chartTone.tooltipColor,
                    }}
                    formatter={(value, name) => [
                      `${Number(value ?? 0)}%`,
                      name === "after" ? "After CVlift" : "Before CVlift",
                    ]}
                    labelStyle={{ color: "#B7FF00", fontWeight: 900 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="before"
                    stroke="rgba(148,163,184,0.72)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, fill: "#94A3B8", stroke: "#F8FAFC" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="after"
                    stroke="url(#cvliftInterviewGradient)"
                    strokeWidth={5}
                    dot={false}
                    activeDot={{
                      r: 7,
                      fill: "#14b8a6",
                      stroke: "#a8ff00",
                      strokeWidth: 3,
                    }}
                    isAnimationActive={isInView}
                    animationDuration={1400}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {kpis.map((item, index) => (
              <motion.div
                key={item.label}
                className="cvlift-roi-card cvlift-kpi-card"
                initial={{ opacity: 0, y: 18 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
                }
                transition={{ delay: index * 0.1 + 0.2, duration: 0.55 }}
                whileHover={{ y: -5, scale: 1.015 }}
              >
                <p className="text-4xl font-black text-white">
                  <AnimatedCounter
                    active={isInView}
                    value={item.value}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    decimals={item.decimals}
                  />
                </p>
                <p className="mt-2 font-mono text-[12px] font-black uppercase text-[#B7FF00]">
                  {item.label}
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#92988E]">
                  <LocalizedString value={item.detail} />
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function RejectionReasonsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hasActiveReason = activeIndex !== null;

  return (
    <motion.section
      ref={ref}
      className="cvlift-roi-section cvlift-rejection-section border-b border-white/8"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <p className="cvlift-roi-eyebrow mx-auto">
            <Zap aria-hidden="true" className="size-4" />
            <LocalizedString
              value={l(
                "Premium AI resume assistant",
                "Премиальный AI-помощник для резюме",
              )}
            />
          </p>
          <h2 className="cvlift-section-title cvlift-rejection-title mt-4 text-white">
            <LocalizedString
              value={l("AI vacancy matching", "Подбор под вакансию")}
            />
            <span className="block cvlift-gradient-text">
              <LocalizedString value={l("based on AI", "на основе AI")} />
            </span>
          </h2>
          <p className="cvlift-rejection-subtitle mx-auto mt-3 max-w-3xl font-mono text-sm font-medium text-[#92988E]">
            <LocalizedString
              value={l(
                "CVlift analyzes vacancy requirements and adapts your resume so it passes filters and moves further.",
                "CVlift анализирует требования вакансии и адаптирует ваше резюме так, чтобы вы проходили дальше.",
              )}
            />
          </p>
        </div>

        <div className="cvlift-reasons-showcase mt-6">
          <div className="cvlift-reason-diagram-grid">
            <div className="cvlift-reason-column cvlift-reason-column-left">
              {leftReasonIndexes.map((reasonIndex) => (
                <ReasonCallout
                  key={rejectionReasons[reasonIndex].label.en}
                  active={activeIndex === reasonIndex}
                  dimmed={hasActiveReason && activeIndex !== reasonIndex}
                  index={reasonIndex}
                  reason={rejectionReasons[reasonIndex]}
                  side="left"
                  onActive={() => setActiveIndex(reasonIndex)}
                  onInactive={() => setActiveIndex(null)}
                />
              ))}
            </div>

            <div className="cvlift-donut-stage">
              <DonutChart
                activeIndex={activeIndex}
                isInView={isInView}
                onActiveChange={setActiveIndex}
              />
            </div>

            <div className="cvlift-reason-column cvlift-reason-column-right">
              {rightReasonIndexes.map((reasonIndex) => (
                <ReasonCallout
                  key={rejectionReasons[reasonIndex].label.en}
                  active={activeIndex === reasonIndex}
                  dimmed={hasActiveReason && activeIndex !== reasonIndex}
                  index={reasonIndex}
                  reason={rejectionReasons[reasonIndex]}
                  side="right"
                  onActive={() => setActiveIndex(reasonIndex)}
                  onInactive={() => setActiveIndex(null)}
                />
              ))}
            </div>
          </div>

          <div className="cvlift-donut-actions">
            <Link href="/upload" className="cvlift-primary-button">
              <LocalizedString value={l("Check resume", "Проверить резюме")} />
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ReasonCallout({
  active,
  dimmed,
  index,
  reason,
  side,
  onActive,
  onInactive,
}: {
  active: boolean;
  dimmed: boolean;
  index: number;
  reason: RejectionReason;
  side: "left" | "right";
  onActive: () => void;
  onInactive: () => void;
}) {
  const Icon = reason.icon;
  const reasonStyle = {
    "--reason-color": reason.color,
  } as CSSProperties;

  return (
    <button
      type="button"
      className={`cvlift-reason-callout cvlift-reason-callout-${side} ${active ? "is-active" : ""} ${dimmed ? "is-dimmed" : ""}`}
      style={reasonStyle}
      onMouseEnter={onActive}
      onMouseLeave={onInactive}
      onFocus={onActive}
      onBlur={onInactive}
      aria-label={`${reason.value}% ${reason.label.en}`}
    >
      <span className="cvlift-reason-icon" aria-hidden="true">
        <Icon className="size-7" />
      </span>
      <span className="cvlift-reason-copy">
        <span className="cvlift-reason-heading">
          <strong>{reason.value}%</strong>
          <span>
            <LocalizedString value={reason.label} />
          </span>
        </span>
        <span className="cvlift-reason-description">
          <LocalizedString value={reason.description} />
        </span>
      </span>
      <span className="cvlift-reason-connector" aria-hidden="true" />
      <span className="cvlift-reason-dot-end" aria-hidden="true" />
      <span className="sr-only">#{index + 1}</span>
    </button>
  );
}

function DonutChart({
  activeIndex,
  isInView,
  onActiveChange,
}: {
  activeIndex: number | null;
  isInView: boolean;
  onActiveChange: (index: number | null) => void;
}) {
  const outerRadius = 82;
  const innerRadius = 50;
  const segmentGapAngle = 7;
  const total = rejectionReasons.reduce((sum, item) => sum + item.value, 0);
  const angleOffsets = useMemo(
    () =>
      rejectionReasons.map((_, index) =>
        rejectionReasons
          .slice(0, index)
          .reduce((sum, item) => sum + (item.value / total) * 360, 0),
      ),
    [total],
  );

  return (
    <div className="cvlift-donut-chart">
      <svg viewBox="0 0 200 200" className="cvlift-donut-ring-svg size-full">
        <g>
          {rejectionReasons.map((item, index) => {
            const sweepAngle = (item.value / total) * 360;
            const startAngle = angleOffsets[index] - 90 + segmentGapAngle / 2;
            const endAngle =
              angleOffsets[index] + sweepAngle - 90 - segmentGapAngle / 2;
            const d = getDonutSegmentPath(
              100,
              100,
              innerRadius,
              outerRadius,
              startAngle,
              endAngle,
            );
            const active = activeIndex === index;
            const visibleOpacity =
              activeIndex === null ? 0.92 : active ? 1 : 0.16;
            const glow = active
              ? `drop-shadow(0 0 18px ${item.color}78)`
              : activeIndex === null
                ? `drop-shadow(0 0 8px ${item.color}28)`
                : `drop-shadow(0 0 3px ${item.color}16)`;

            return (
              <path
                key={item.label.en}
                d={d}
                fill={item.color}
                opacity={isInView ? visibleOpacity : 0}
                style={{
                  filter: glow,
                  transition:
                    "opacity 0.18s cubic-bezier(0.22,1,0.36,1), filter 0.18s cubic-bezier(0.22,1,0.36,1), transform 0.18s cubic-bezier(0.22,1,0.36,1)",
                }}
                transform={
                  active
                    ? "translate(100 100) scale(1.035) translate(-100 -100)"
                    : "translate(100 100) scale(1) translate(-100 -100)"
                }
                onMouseEnter={() => onActiveChange(index)}
                onMouseLeave={() => onActiveChange(null)}
                onFocus={() => onActiveChange(index)}
                onBlur={() => onActiveChange(null)}
                aria-label={`${item.value}% ${item.label.en}`}
                className="cvlift-donut-segment"
                tabIndex={0}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function getDonutSegmentPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const sweepAngle = endAngle - startAngle;
  const cornerRadius = Math.min(
    8,
    (outerRadius - innerRadius) / 2 - 1,
    Math.max(1, ((sweepAngle * Math.PI) / 180 * innerRadius) / 4),
  );
  const outerAngleOffset = radiansToDegrees(cornerRadius / outerRadius);
  const innerAngleOffset = radiansToDegrees(cornerRadius / innerRadius);
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle + outerAngleOffset);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle - outerAngleOffset);
  const outerEndCorner = polarToCartesian(cx, cy, outerRadius, endAngle);
  const endOuterInset = polarToCartesian(cx, cy, outerRadius - cornerRadius, endAngle);
  const endInnerInset = polarToCartesian(cx, cy, innerRadius + cornerRadius, endAngle);
  const innerEndCorner = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle - innerAngleOffset);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle + innerAngleOffset);
  const innerStartCorner = polarToCartesian(cx, cy, innerRadius, startAngle);
  const startInnerInset = polarToCartesian(cx, cy, innerRadius + cornerRadius, startAngle);
  const startOuterInset = polarToCartesian(cx, cy, outerRadius - cornerRadius, startAngle);
  const outerStartCorner = polarToCartesian(cx, cy, outerRadius, startAngle);
  const largeArcFlag = sweepAngle - outerAngleOffset * 2 > 180 ? 1 : 0;

  return [
    `M ${formatPathNumber(outerStart.x)} ${formatPathNumber(outerStart.y)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${formatPathNumber(outerEnd.x)} ${formatPathNumber(outerEnd.y)}`,
    `Q ${formatPathNumber(outerEndCorner.x)} ${formatPathNumber(outerEndCorner.y)} ${formatPathNumber(endOuterInset.x)} ${formatPathNumber(endOuterInset.y)}`,
    `L ${formatPathNumber(endInnerInset.x)} ${formatPathNumber(endInnerInset.y)}`,
    `Q ${formatPathNumber(innerEndCorner.x)} ${formatPathNumber(innerEndCorner.y)} ${formatPathNumber(innerEnd.x)} ${formatPathNumber(innerEnd.y)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${formatPathNumber(innerStart.x)} ${formatPathNumber(innerStart.y)}`,
    `Q ${formatPathNumber(innerStartCorner.x)} ${formatPathNumber(innerStartCorner.y)} ${formatPathNumber(startInnerInset.x)} ${formatPathNumber(startInnerInset.y)}`,
    `L ${formatPathNumber(startOuterInset.x)} ${formatPathNumber(startOuterInset.y)}`,
    `Q ${formatPathNumber(outerStartCorner.x)} ${formatPathNumber(outerStartCorner.y)} ${formatPathNumber(outerStart.x)} ${formatPathNumber(outerStart.y)}`,
    "Z",
  ].join(" ");
}

function formatPathNumber(value: number) {
  return Number(value.toFixed(4));
}

function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) {
  const radians = (angle * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function AnimatedCounter({
  active,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  active: boolean;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    const controls = animate(0, value, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setDisplayValue,
    });

    return () => controls.stop();
  }, [active, value]);

  return (
    <>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </>
  );
}
