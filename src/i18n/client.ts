"use client";

import { useEffect, useState } from "react";
import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTransAlias,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getOptions, supportedLocales } from "./settings";
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
    lng: undefined, // detect the language on the client
    detection: {
      convertDetectedLanguage,
      // This will automatically update the cookie
      caches: ["cookie"],
    },
    preload: runsOnServerSide ? supportedLocales : [],
  });

export function useTranslation() {
  const lng = useLocale();

  // Run content is being rendered on server side
  if (runsOnServerSide && lng && i18next.resolvedLanguage !== lng) {
    i18next.changeLanguage(lng);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18next.resolvedLanguage) {
        return;
      }
      setActiveLng(i18next.resolvedLanguage);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLng, i18next.resolvedLanguage]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18next.resolvedLanguage === lng) {
        return;
      }
      i18next.changeLanguage(lng);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lng, i18next]);
  }
  return useTransAlias();
}
