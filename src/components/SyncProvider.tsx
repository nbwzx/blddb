"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { isDesktop, getLastSync, syncNow, SYNC_PATHS } from "@/utils/syncData";

type SyncState = {
  lastSync: number | null;
  syncing: boolean;
  enabled: boolean;
  sync: () => Promise<void>;
};

const SyncContext = createContext<SyncState>({
  lastSync: null,
  syncing: false,
  enabled: false,
  sync: async () => undefined,
});

export const useSync = () => useContext(SyncContext);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    setLastSync(await getLastSync());
  }, []);

  const sync = useCallback(async () => {
    if (!isDesktop()) {
      return;
    }
    setSyncing(true);
    try {
      await syncNow(SYNC_PATHS);
      await refresh();
    } finally {
      setSyncing(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (!isDesktop()) {
      return;
    }
    refresh();
    (async () => {
      const last = await getLastSync();
      const day = 24 * 60 * 60 * 1000;
      if (last === null || Date.now() - last > day) {
        await sync();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SyncContext.Provider
      value={{ lastSync, syncing, enabled: isDesktop(), sync }}
    >
      {children}
    </SyncContext.Provider>
  );
};
