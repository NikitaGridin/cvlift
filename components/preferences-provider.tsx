"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  isLocale,
  translate,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n";

type PreferencesContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const legacyPreferencePrefix = "cv" + "pilot";
const localeStorageKey = "cvlift_locale";
const legacyLocaleStorageKey = `${legacyPreferencePrefix}_locale`;

export function PreferencesProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [preferencesReady, setPreferencesReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLocaleState(readStoredLocale(initialLocale));
      setPreferencesReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [initialLocale]);

  useEffect(() => {
    if (!preferencesReady) {
      return;
    }

    document.documentElement.lang = locale;
    window.localStorage.setItem(localeStorageKey, locale);
    writePreferenceCookie(localeStorageKey, locale);
  }, [locale, preferencesReady]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: (key, values) => translate(locale, key, values),
    }),
    [locale],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider.");
  }

  return context;
}

export function useI18n() {
  const { locale, setLocale, t } = usePreferences();
  return { locale, setLocale, t };
}

function readStoredLocale(initialLocale: Locale): Locale {
  const storedLocale =
    window.localStorage.getItem(localeStorageKey) ??
    window.localStorage.getItem(legacyLocaleStorageKey);

  if (isLocale(storedLocale)) {
    return storedLocale;
  }

  if (isLocale(document.documentElement.lang)) {
    return document.documentElement.lang;
  }

  return window.navigator.language?.toLowerCase().startsWith("ru") ? "ru" : initialLocale;
}

function writePreferenceCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}
