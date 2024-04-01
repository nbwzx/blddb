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
