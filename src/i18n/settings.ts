import type { InitOptions } from "i18next";

export const FALLBACK_LOCALE = "en";
export const supportedLocales = ["en", "zh-CN", "ja"] as const;
export type Locales = (typeof supportedLocales)[number];

export function getOptions(lang = FALLBACK_LOCALE): InitOptions {
  return {
    // debug: true, // Set to true to see console logs
    fallbackLng: FALLBACK_LOCALE,
    lng: lang,
  };
}

export function normalizeLocale(lng: string | null | undefined): Locales {
  if (!lng) {
    return FALLBACK_LOCALE;
  }
  if (lng.startsWith("zh")) {
    return "zh-CN";
  }
  if (lng.startsWith("ja")) {
    return "ja";
  }
  return FALLBACK_LOCALE;
}

export function isCJK(locale: string): boolean {
  return locale.startsWith("zh") || locale.startsWith("ja");
}
