"use client";

import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTransAlias,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getOptions, supportedLocales, normalizeLocale } from "./settings";
import { useLocale } from "../app/localeProvider";
import { getItem, setItem } from "@/utils/settings";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";

const runsOnServerSide = typeof window === "undefined";

// Initialize i18next for the client side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (lang: string) => import(`public/locales/${normalizeLocale(lang)}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined, // detect the language on the client
    detection: {
      convertDetectedLanguage: normalizeLocale,
      // This will automatically update the cookie
      caches: ["cookie"],
      cookieMinutes: 576000,
    },
    preload: supportedLocales,
  });

if (!runsOnServerSide) {
  if (getItem("code") === null) {
    const browserLanguage = navigator.language;
    const isChinese = browserLanguage.startsWith("zh");
    if (!isChinese) {
      setItem("code", codeConverter.letteringSchemes["Speffz"]);
      setItem("bigbldCode", bigbldCodeConverter.letteringSchemes["Speffz"]);
    }
  }
}

export function useTranslation() {
  const lng = useLocale();
  if (
    typeof window === "undefined" &&
    lng &&
    i18next.resolvedLanguage !== lng
  ) {
    i18next.changeLanguage(lng);
  }
  return useTransAlias();
}

export function seedInitialI18n(
  locale: string,
  resources: Record<string, unknown>,
) {
  if (typeof window === "undefined" || !resources) {
    return;
  }
  i18next.addResourceBundle(locale, "translation", resources, true, true);
  if (i18next.resolvedLanguage !== locale) {
    i18next.changeLanguage(locale);
  }
}
