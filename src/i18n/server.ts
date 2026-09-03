import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions, Locales, normalizeLocale } from "./settings";
import { cookies, headers } from "next/headers";

async function initI18next(lang: Locales) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        // Get the JSON file that matches the locale and namespace
        (langName: string) => import(`public/locales/${langName}.json`),
      ),
    )
    // Initialize i18next with the options we created earlier
    .init(getOptions(lang));

  return i18nInstance;
}

// This function will be used in our server components for the translation
export async function createTranslation() {
  const lang = await getLocale();
  const i18nextInstance = await initI18next(lang);

  return {
    t: i18nextInstance.getFixedT(lang),
    locale: lang,
  };
}

// Utility function to get the locale from server components
export async function getLocale(): Promise<Locales> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("i18next")?.value;
  if (cookieLocale) {
    return normalizeLocale(cookieLocale);
  }
  const headerStore = await headers();
  return normalizeLocale(headerStore.get("accept-language"));
}

export async function loadLocaleResources(
  lang: Locales,
): Promise<Record<string, unknown>> {
  const mod = await import(`public/locales/${lang}.json`);
  return ((mod as { default?: Record<string, unknown> }).default ??
    mod) as Record<string, unknown>;
}
