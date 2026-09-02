"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { FALLBACK_LOCALE, Locales } from "../i18n/settings";

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
  const [locale, setLocaleState] = useState<Locales>(value);
  const setLocale = (next: Locales) => {
    setLocaleState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  };
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
