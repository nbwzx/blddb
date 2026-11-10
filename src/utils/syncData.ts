// Offline desktop data sync (Tauri only).

const REPO = "nbwzx/blddb";
const BRANCH = "v2";

export const DATA_BASE =
  process.env.NEXT_PUBLIC_DATA_BASE ||
  `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;

export const isDesktop = (): boolean =>
  typeof window !== "undefined" &&
  ("__TAURI_INTERNALS__" in window || "__TAURI__" in window);

const DB_NAME = "blddb-sync";
const STORE = "data";
const META_KEY = "__meta_lastSync";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("indexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve((req.result as string) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function idbSet(key: string, value: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* ignore storage errors */
  }
}

export async function getLastSync(): Promise<number | null> {
  const v = await idbGet(META_KEY);
  return v ? Number(v) : null;
}

// Load JSON from the local cache (IndexedDB, written by syncNow) or the
// bundled build-time snapshot. Never blocks on the network — syncing is
// syncNow's job, so page loads stay instant even on a bad connection.
export async function loadJsonData<T = unknown>(
  logicalPath: string,
  bundledLoader: () => Promise<{ default: T }>,
): Promise<{ default: T }> {
  const cached = await idbGet(logicalPath);
  if (cached !== null) {
    try {
      return { default: JSON.parse(cached) as T };
    } catch {
      /* corrupt cache; fall through to bundled */
    }
  }
  return bundledLoader();
}

// Background refresh of the local cache from GitHub Raw. Each request is
// capped at 8s so a slow/flaky network can't hang the app; failures are
// ignored per file. Only updates the sync marker when at least one file
// landed, so a failed attempt doesn't reset the 24h auto-sync gate.
export async function syncNow(paths: string[]): Promise<number> {
  if (!isDesktop()) {
    return 0;
  }
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return 0;
  }
  let ok = 0;
  await Promise.all(
    paths.map(async (p) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      try {
        const res = await fetch(`${DATA_BASE}/${p}`, {
          cache: "no-store",
          signal: ctrl.signal,
        });
        if (!res.ok) {
          return;
        }
        const text = await res.text();
        JSON.parse(text);
        await idbSet(p, text);
        ok += 1;
      } catch {
        /* ignore individual failures */
      } finally {
        clearTimeout(timer);
      }
    }),
  );
  if (ok > 0) {
    await idbSet(META_KEY, String(Date.now()));
  }
  return ok;
}

// Data kept in sync (weekly-updated DB; static .ts tables excluded).
export const SYNC_PATHS: string[] = [
  "public/data/algToUrl.json",
  "public/data/sourceToUrl.json",
  "public/data/sourceToResult.json",
  "public/data/sourceToYoutube.json",
  "public/data/cornerManmade.json",
  "public/data/cornerNightmare.json",
  "public/data/cornerNightmareSelected.json",
  "public/data/edgeManmade.json",
  "public/data/edgeNightmare.json",
  "public/data/edgeNightmareSelected.json",
  "public/data/flipsManmade.json",
  "public/data/flipsNightmare.json",
  "public/data/flipsNightmareSelected.json",
  "public/data/ltctManmade.json",
  "public/data/ltctNightmare.json",
  "public/data/parityManmade.json",
  "public/data/parityNightmare.json",
  "public/data/parityNightmareSelected.json",
  "public/data/twistsManmade.json",
  "public/data/twistsNightmare.json",
  "public/data/bigbld/midgeManmade.json",
  "public/data/bigbld/tcenterManmade.json",
  "public/data/bigbld/wingManmade.json",
  "public/data/bigbld/xcenterManmade.json",
];
