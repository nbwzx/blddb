"use client";

export async function switchLocaleAction(value: string) {
  // Set cookie directly in browser
  document.cookie = `i18next=${value}; path=/; max-age=34560000`;
  // Refresh the page
  window.location.reload();
}
