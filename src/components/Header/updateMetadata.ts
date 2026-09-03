import type { TFunction } from "i18next";

export function updateMetadata(document: Document, t: TFunction) {
  const apply = (): boolean => {
    const metaTitleLocales = document.querySelector(
      "meta[name='title_locales']",
    );
    if (metaTitleLocales instanceof HTMLMetaElement) {
      document.title = t(metaTitleLocales.content);
      return true;
    }
    return false;
  };

  if (apply()) {
    return;
  }
  if (typeof MutationObserver === "undefined") {
    return;
  }
  const observer = new MutationObserver(() => {
    if (apply()) {
      observer.disconnect();
    }
  });
  observer.observe(document.head, { childList: true, subtree: true });
  // Stop watching if the tag never shows up.
  setTimeout(() => observer.disconnect(), 2000);
}
