"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

type ScoreRingProps = {
  score: number;
  label?: string;
  size?: "sm" | "lg";
};

export function ScoreRing({
  score,
  label = "AI score",
  size = "lg",
}: ScoreRingProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => Math.round(value));
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444";
  const degrees = Math.max(0, Math.min(100, score)) * 3.6;
  const dimensions = size === "lg" ? "size-44" : "size-28";

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    });

    return controls.stop;
  }, [count, score]);

  return (
    <div
      aria-label={`${label}: ${score}/100`}
      className={`${dimensions} rounded-full p-[10px] shadow-[0_20px_60px_rgba(15,23,42,0.08)]`}
      style={{
        background: `conic-gradient(${color} ${degrees}deg, rgba(15,23,42,0.08) 0deg)`,
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-black/[0.06] bg-white/90 backdrop-blur">
        <div className="flex items-end gap-1 text-[#0F172A]">
          <motion.span
            className={
              size === "lg" ? "text-5xl font-bold" : "text-3xl font-bold"
            }
          >
            {rounded}
          </motion.span>
          <span className="pb-1 text-sm font-semibold text-[#64748B]">
            /100
          </span>
        </div>
      </div>
    </div>
  );
}
