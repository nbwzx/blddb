import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions, Locales } from "./settings";
import { cookies } from "next/headers";

async function initI18next(lang: Locales) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        // Get the JSON file that matches the locale and namespace
        (lang: string) => import(`public/locales/${lang}.json`),
      ),
    )
    // Initialize i18next with the options we created earlier
    .init(getOptions(lang));

  return i18nInstance;
}

// This function will be used in our server components for the translation
export async function createTranslation() {
  const lang = getLocale();
  const i18nextInstance = await initI18next(lang);

  return {
    t: i18nextInstance.getFixedT(lang),
  };
}

// Utility function to get the locale from server components
export function getLocale() {
  return cookies().get("i18next")?.value as Locales;
}
