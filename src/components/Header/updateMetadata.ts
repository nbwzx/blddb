import { useTranslation } from "@/i18n/client";

export function updateMetadata(
  document: Document,
  t: ReturnType<typeof useTranslation>["t"],
) {
  const metaTitleLocales = document.querySelector("meta[name='title_locales']");
  if (metaTitleLocales instanceof HTMLMetaElement) {
    document.title = t(metaTitleLocales.content);
  }
}
