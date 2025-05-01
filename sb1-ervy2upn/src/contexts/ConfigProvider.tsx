import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfigContextType {
  earlyChurnMonths: number;
  setEarlyChurnMonths: (months: number) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [earlyChurnMonths, setEarlyChurnMonths] = useState(3);

  const value = {
    earlyChurnMonths,
    setEarlyChurnMonths,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}