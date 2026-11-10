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

// Mirror the choice across every channel the app reads from: our own keys,
// the cookie consumed by server-side getLocale(), and the language detector's
// cache key. Embedded WebViews can drop any single one of them on restart.
const LOCALE_KEY = "blddb.locale";
const COOKIE_KEY = "blddb_locale";
const SERVER_COOKIE_KEY = "i18next";
const DETECTOR_KEY = "i18nextLng";
const COOKIE_OPTIONS = "path=/; max-age=34560000; SameSite=Lax";

function writeCookie(name: string, value: string): boolean {
  try {
    document.cookie = `${name}=${value}; ${COOKIE_OPTIONS}`;
    return true;
  } catch {
    return false;
  }
}

function readCookie(name: string): string | null {
  try {
    const match = document.cookie
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${name}=`));
    return match ? match.slice(`${name}=`.length) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function readLocal(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function persistLocale(locale: string): void {
  const value = normalizeLocale(locale);
  writeCookie(COOKIE_KEY, value);
  writeCookie(SERVER_COOKIE_KEY, value);
  writeCookie(DETECTOR_KEY, value);
  writeLocal(LOCALE_KEY, value);
  writeLocal(DETECTOR_KEY, value);
}

export function loadPersistedLocale(): string | null {
  // Own keys first: the detector cache may still hold a stale "en" written by
  // an older build, and must not outrank the user's explicit choice.
  const candidates = [
    readCookie(COOKIE_KEY),
    readLocal(LOCALE_KEY),
    readCookie(SERVER_COOKIE_KEY),
    readCookie(DETECTOR_KEY),
    readLocal(DETECTOR_KEY),
  ];
  const value = candidates.find(
    (candidate) => candidate !== null && candidate !== "",
  );
  return value ? normalizeLocale(value) : null;
}

const savedLocale = runsOnServerSide ? null : loadPersistedLocale();

// Initialize i18next for the client side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (lang: string) => import(`public/locales/${normalizeLocale(lang)}.json`),
    ),
  )
  .init(
    {
      ...getOptions(),
      // A persisted choice always wins over detection; on the first run there
      // is none, so the detector picks the system language.
      lng: savedLocale ?? undefined,
      detection: {
        convertDetectedLanguage: normalizeLocale,
        caches: ["localStorage", "cookie"],
        cookieMinutes: 576000,
      },
      preload: supportedLocales,
    },
    () => {
      // Backend loading/detection can settle after other startup work. Make
      // sure the final language still matches the user's saved choice.
      if (savedLocale && i18next.resolvedLanguage !== savedLocale) {
        i18next.changeLanguage(savedLocale);
      }
    },
  );

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

  // Only seed the server-rendered resources. The client language is decided
  // exclusively by init() (persisted choice, then detection). Forcing the SSR
  // locale here resets the saved choice on every load, because the static
  // desktop export is always built with "en".
  i18next.addResourceBundle(locale, "translation", resources, true, true);
}
