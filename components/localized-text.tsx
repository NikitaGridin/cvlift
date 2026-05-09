"use client";

import { useI18n } from "@/components/preferences-provider";
import { defaultLocale, type LocalizedValue, type TranslationKey } from "@/lib/i18n";

export function LocalizedText({
  k,
  values,
}: {
  k: TranslationKey;
  values?: Record<string, string | number>;
}) {
  const { t } = useI18n();
  return <>{t(k, values)}</>;
}

export function LocalizedString({ value }: { value: LocalizedValue<string> }) {
  const { locale } = useI18n();
  return <>{value[locale] ?? value[defaultLocale]}</>;
}
