"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useSetState } from "react-use";

import { AppState } from "./types";

const appState: AppState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
};

type AppContextType = {
  state: AppState;
  setState: (
    // eslint-disable-next-line no-unused-vars
    patch: Partial<AppState> | ((prevState: AppState) => Partial<AppState>),
  ) => void;
};

const defaultSetState: AppContextType["setState"] = () => {
  throw new Error("setState must be used within AppProvider");
};

export const AppContext = createContext<AppContextType>({
  state: appState,
  setState: defaultSetState,
});
AppContext.displayName = "AppContext";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useSetState(appState);

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [state, setState],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
}
