"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  type Dictionary,
  type Locale,
} from "@/content/i18n";

const STORAGE_KEY = "portofino:locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Holds the active locale for the whole tree.
 *
 * The first render is always `defaultLocale` so that the statically exported
 * HTML and the first client render agree — a stored preference is applied in an
 * effect, after hydration, which avoids a mismatch.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private browsing or storage disabled — stay on the default locale.
    }
    if (isLocale(stored) && stored !== locale) setLocaleState(stored);
    // Runs once: a stored preference only needs restoring on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not fatal: the choice simply will not survive a reload.
    }
  }, []);

  // Keep <html lang> honest for screen readers and translation tools.
  useEffect(() => {
    document.documentElement.lang = getDictionary(locale).htmlLang;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: getDictionary(locale) }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside <LocaleProvider>");
  }
  return ctx;
}

/** Shorthand for components that only need the dictionary. */
export function useT(): Dictionary {
  return useLocale().t;
}
