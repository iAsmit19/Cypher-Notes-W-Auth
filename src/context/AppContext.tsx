"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobaContextType {
  addPanelState: boolean;
  setAddPanelState: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobaContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [addPanelState, setAddPanelState] = useState(false);

  return (
    <GlobalContext.Provider value={{ addPanelState, setAddPanelState}}>
      { children }
    </GlobalContext.Provider>
  )
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};