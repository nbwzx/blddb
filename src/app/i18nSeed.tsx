"use client";

import { seedInitialI18n } from "@/i18n/client";

export function I18nSeed({
  locale,
  resources,
}: {
  locale: string;
  resources: Record<string, unknown>;
}) {
  seedInitialI18n(locale, resources);
  return null;
}
