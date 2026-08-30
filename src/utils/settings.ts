export type SettingsValue = string | boolean | string[];
export type Settings = Record<string, SettingsValue>;
export type DefaultableSetting = { id: string; default?: SettingsValue };

export function getItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(key);
}

export function setItem(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(key, value);
}

export function loadSettings(defaults: Settings = {}) {
  const saved = getItem("settings");
  if (!saved) {
    return { ...defaults };
  }
  try {
    return { ...defaults, ...JSON.parse(saved) };
  } catch {
    return { ...defaults };
  }
}

export function saveSettings(settings: Settings): void {
  setItem("settings", JSON.stringify(settings));
}

export function buildDefaults(
  settingsGroups: Record<string, DefaultableSetting[]>,
): Settings {
  const defaults: Settings = {};
  Object.values(settingsGroups)
    .flat()
    .forEach((setting) => {
      if (typeof setting.default !== "undefined") {
        defaults[setting.id] = setting.default;
      }
    });
  return defaults;
}

const CUSTOM_ALGS_KEY = "customAlgs";

export type CustomAlgorithms = Record<string, string>;
export type CustomAlgorithmStore = Record<string, CustomAlgorithms>;

export function loadCustomAlgorithms(codeType: string): CustomAlgorithms {
  try {
    const store = JSON.parse(
      getItem(CUSTOM_ALGS_KEY) || "{}",
    ) as CustomAlgorithmStore | null;
    return store?.[codeType] ?? {};
  } catch {
    return {};
  }
}

export function saveCustomAlgorithms(
  codeType: string,
  algorithms: CustomAlgorithms,
): void {
  const store: CustomAlgorithmStore = {};
  try {
    Object.assign(
      store,
      JSON.parse(getItem(CUSTOM_ALGS_KEY) || "{}") as CustomAlgorithmStore,
    );
  } catch {
    // keep an empty store if the existing value is corrupt
  }
  if (Object.keys(algorithms).length === 0) {
    Reflect.deleteProperty(store, codeType);
  } else {
    store[codeType] = algorithms;
  }
  setItem(CUSTOM_ALGS_KEY, JSON.stringify(store));
}
