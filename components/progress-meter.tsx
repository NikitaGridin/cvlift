"use client";

import { motion } from "framer-motion";

type ProgressMeterProps = {
  label: string;
  value: number;
};

export function ProgressMeter({ label, value }: ProgressMeterProps) {
  const color = value >= 80 ? "#22C55E" : value >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-[#0F172A]">{label}</span>
        <span className="font-bold text-[#0F172A]">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#E8ECF2]">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
