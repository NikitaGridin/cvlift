"use client";

import { motion } from "framer-motion";
import { FileText, LinkIcon, ScanSearch, UploadCloud } from "lucide-react";
import { useI18n } from "@/components/preferences-provider";
import type { TranslationKey } from "@/lib/i18n";

const steps = [
  { labelKey: "preview.steps.upload", icon: UploadCloud },
  { labelKey: "preview.steps.analyze", icon: ScanSearch },
  { labelKey: "preview.steps.improve", icon: FileText },
].map((item) => ({ ...item, labelKey: item.labelKey as TranslationKey }));

export function ProductPreview() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[28px] border border-black/[0.06] bg-white/75 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-5"
    >
      <div className="rounded-[24px] border border-black/[0.06] bg-[#FAFBFC] p-4 sm:p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#0F172A]">{t("preview.title")}</p>
            <p className="text-xs font-semibold text-[#64748B]">{t("preview.subtitle")}</p>
          </div>
          <span className="rounded-full bg-[#6366F1]/10 px-3 py-1 text-xs font-bold text-[#4F46E5]">
            {t("preview.badge")}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.labelKey}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                className="rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#6366F1]">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-[#0F172A]">{t(step.labelKey)}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[22px] border border-dashed border-black/10 bg-white p-5">
            <div className="flex min-h-36 flex-col items-center justify-center text-center">
              <UploadCloud aria-hidden="true" className="size-7 text-[#6366F1]" />
              <p className="mt-3 text-sm font-bold text-[#0F172A]">{t("preview.fileTypes")}</p>
              <p className="mt-1 text-xs font-semibold text-[#64748B]">{t("preview.upload")}</p>
            </div>
          </div>

          <div className="rounded-[22px] border border-black/[0.06] bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
              <LinkIcon aria-hidden="true" className="size-4 text-[#6366F1]" />
              {t("preview.vacancyMode")}
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-9 rounded-full bg-[#6366F1]/10" />
              <div className="h-9 rounded-full bg-[#EEF2F7]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
