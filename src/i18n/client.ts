"use client";

import { useEffect } from "react";
import i18next, { i18n } from "i18next";
import {
  initReactI18next,
  useTranslation as useTransAlias,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { Locales, getOptions, supportedLocales } from "./settings";
import { useLocale } from "../app/localeProvider";

const runsOnServerSide = typeof window === "undefined";
const convertDetectedLanguage = (lng: string) => {
  if (lng.startsWith("zh")) {
    return "zh-CN";
  } else if (lng.startsWith("ja")) {
    return "ja";
  }
  return "en";
};

// Initialize i18next for the client side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (lang: string) =>
        import(`public/locales/${convertDetectedLanguage(lang)}.json`),
    ),
  )
  .init({
    ...getOptions(),
    detection: {
      convertDetectedLanguage,
      // This will automatically update the cookie
      caches: ["cookie"],
    },
    preload: runsOnServerSide ? supportedLocales : [],
  });

export function useTranslation() {
  const lng = useLocale();

  const translator = useTransAlias();
  const { i18n: i18nTranslator } = translator;

  // Run content is being rendered on server side
  if (runsOnServerSide && lng && i18nTranslator.resolvedLanguage !== lng) {
    i18nTranslator.changeLanguage(lng);
  } else {
    // Use our custom implementation when running on client side
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCustomTranslationImplem(i18nTranslator, lng);
  }
  return translator;
}

function useCustomTranslationImplem(i18nInput: i18n, lng: Locales) {
  // This effect changes the language of the application when the lng prop changes.
  useEffect(() => {
    if (!lng || i18nInput.resolvedLanguage === lng) {
      return;
    }
    i18nInput.changeLanguage(lng);
  }, [lng, i18nInput]);
}
