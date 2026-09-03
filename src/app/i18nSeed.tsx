"use client";

import { useState } from "react";
import { seedInitialI18n } from "@/i18n/client";

export function I18nSeed({
  locale,
  resources,
}: {
  locale: string;
  resources: Record<string, unknown>;
}) {
  useState(() => {
    seedInitialI18n(locale, resources);
    return null;
  });
  return null;
}
