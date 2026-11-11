"use client";

import React from "react";
import { useSync } from "./SyncProvider";

function formatTime(ts: number | null): string {
  if (!ts) {
    return "never";
  }
  return new Date(ts).toLocaleString();
}

const SyncButton: React.FC = () => {
  const { lastSync, syncing, sync, enabled } = useSync();
  if (!enabled) {
    return null;
  }

  return (
    <div
      className="flex items-center"
      title={`Last synced: ${formatTime(lastSync)}`}
    >
      <button
        type="button"
        onClick={() => sync()}
        disabled={syncing}
        className="text-dark mr-2 flex min-w-[80px] items-center justify-center rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
      >
        {syncing ? "Syncing…" : "Sync"}
      </button>
    </div>
  );
};

export default SyncButton;
