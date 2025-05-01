import React, { createContext, useContext, useState } from 'react';

interface ConfigContextType {
  earlyChurnMonths: number;
  setEarlyChurnMonths: (months: number) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [earlyChurnMonths, setEarlyChurnMonths] = useState(3);

  return (
    <ConfigContext.Provider value={{ earlyChurnMonths, setEarlyChurnMonths }}>
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