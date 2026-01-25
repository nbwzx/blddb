"use client";

import i18next from "i18next";
export async function switchLocaleAction(value: string) {
  // Set cookie directly in browser
  document.cookie = `i18next=${value}; path=/; max-age=34560000`;

  // Change language without reloading
  await i18next.changeLanguage(value);
}
