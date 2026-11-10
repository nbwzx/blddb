"use client";

import { ThemeProvider } from "next-themes";
import React from "react";
import { SyncProvider } from "@/components/SyncProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <SyncProvider>{children}</SyncProvider>
    </ThemeProvider>
  );
}
