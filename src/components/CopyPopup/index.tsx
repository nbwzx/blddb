"use client";

import { useTranslation } from "@/i18n/client";

export default function CopyPopup({ show }: { show: boolean }) {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  return (
    <div
      id="copypopup"
      className="fade-in-out fixed bottom-[30px] left-1/2 z-50 -translate-x-1/2 transform rounded-md border-2 bg-gray-100 p-4 text-black shadow-lg dark:bg-gray-700 dark:text-white"
      style={{
        animation: "fadein 0.5s ease forwards, fadeout 0.5s ease 1.5s forwards",
      }}
    >
      <span className="text-lg">{t("table.copied")}</span>
    </div>
  );
}
