import React, { createContext, useContext, useState, useEffect } from 'react';
import { enUS } from '../locales/en-US';
import { ptBR } from '../locales/pt-BR';

type Language = 'en-US' | 'pt-BR';
type Translations = typeof enUS;

interface LanguageContextType {
  language: Language;
  t: (key: keyof typeof enUS) => string;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferredLanguage');
    return (saved as Language) || 
           (navigator.language.startsWith('pt') ? 'pt-BR' : 'en-US');
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  const translations: Record<Language, Translations> = {
    'en-US': enUS,
    'pt-BR': ptBR,
  };

  const t = (key: keyof typeof enUS) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}