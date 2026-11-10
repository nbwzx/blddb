"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { FALLBACK_LOCALE, Locales, supportedLocales } from "../i18n/settings";
import i18next from "i18next";
import { persistLocale, loadPersistedLocale } from "@/i18n/client";

type LocaleContextValue = {
  locale: Locales;
  // eslint-disable-next-line no-unused-vars
  setLocale: (locale: Locales) => void;
};

const Context = createContext<LocaleContextValue>({
  locale: FALLBACK_LOCALE,
  setLocale: () => undefined,
});

export function LocaleProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Locales;
}) {
  const [locale, setLocaleState] = useState<Locales>(() => {
    if (typeof window === "undefined") {
      return value;
    }
    const persisted = loadPersistedLocale();
    return (
      persisted && supportedLocales.includes(persisted as Locales)
        ? persisted
        : value
    ) as Locales;
  });
  const setLocale = (next: Locales) => {
    setLocaleState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
    if (typeof window !== "undefined") {
      i18next.changeLanguage(next);
    }
    persistLocale(next);
  };
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  const ctx = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale }),
    [locale],
  );
  return <Context.Provider value={ctx}>{children}</Context.Provider>;
}

export function useLocale() {
  return useContext(Context).locale;
}

export function useSetLocale() {
  return useContext(Context).setLocale;
}
