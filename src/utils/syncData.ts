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

// Load JSON, mirroring a static import()'s { default } shape.
export async function loadJsonData<T = unknown>(
  logicalPath: string,
  bundledLoader: () => Promise<{ default: T }>,
  timeoutMs = 6000,
): Promise<{ default: T }> {
  const remoteUrl = `${DATA_BASE}/${logicalPath}`;

  const tryRemote = async (): Promise<{ default: T } | undefined> => {
    if (!isDesktop()) {
      return undefined;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return undefined;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(remoteUrl, {
        signal: ctrl.signal,
        cache: "no-store",
      });
      if (!res.ok) {
        return undefined;
      }
      const text = await res.text();
      const json = JSON.parse(text) as T;
      idbSet(logicalPath, text);
      idbSet(META_KEY, String(Date.now()));
      return { default: json };
    } catch {
      return undefined;
    } finally {
      clearTimeout(timer);
    }
  };

  const remote = tryRemote();
  const bundled = bundledLoader();

  const remoteResult = await remote;
  if (remoteResult !== undefined) {
    return remoteResult;
  }

  const bundledResult = await bundled.catch(() => undefined);
  if (bundledResult !== undefined) {
    return bundledResult;
  }

  const cached = await idbGet(logicalPath);
  if (cached !== null) {
    return { default: JSON.parse(cached) as T };
  }

  throw new Error(`Unable to load ${logicalPath}`);
}

export async function syncNow(paths: string[]): Promise<void> {
  if (!isDesktop()) {
    return;
  }
  await Promise.all(
    paths.map(async (p) => {
      try {
        const res = await fetch(`${DATA_BASE}/${p}`, { cache: "no-store" });
        if (!res.ok) {
          return;
        }
        const text = await res.text();
        JSON.parse(text);
        await idbSet(p, text);
      } catch {
        /* ignore individual failures */
      }
    }),
  );
  await idbSet(META_KEY, String(Date.now()));
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
