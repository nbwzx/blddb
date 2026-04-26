"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TourContextProps {
  startTour: () => void;
  isTourRunning: boolean;
  stopTour: () => void;
}

const TourContext = createContext<TourContextProps | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};

export const JoyrideProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isTourRunning, setIsTourRunning] = useState(false);

  const startTour = () => setIsTourRunning(true);
  const stopTour = () => setIsTourRunning(false);

  return (
    <TourContext.Provider value={{ startTour, isTourRunning, stopTour }}>
      {children}
    </TourContext.Provider>
  );
};
