"use client";

import { Languages } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";

export function PreferenceControls() {
  const { locale, setLocale, t } = usePreferences();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
        aria-label={t("common.language")}
        title={t("common.language")}
        className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white/75 px-3 text-sm font-bold text-[#0F172A] shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white"
      >
        <Languages aria-hidden="true" className="size-4 text-[#6366F1]" />
        <span>{locale.toUpperCase()}</span>
      </button>
    </div>
  );
}
