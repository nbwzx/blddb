import { useTranslation } from "@/i18n/client";

export function updateMetadata(
  document: Document,
  t: ReturnType<typeof useTranslation>["t"],
) {
  const checkMetaTag = async (
    maxAttempts = 10,
    interval = 100,
  ): Promise<void> => {
    const attemptCheck = async (attempt: number): Promise<void> => {
      const metaTitleLocales = document.querySelector(
        "meta[name='title_locales']",
      );
      if (metaTitleLocales instanceof HTMLMetaElement) {
        document.title = t(metaTitleLocales.content);
        return;
      }
      if (attempt < maxAttempts) {
        await new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
        await attemptCheck(attempt + 1);
      }
    };
    await attemptCheck(0);
  };
  checkMetaTag();
}
