'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Locale, getTranslations, Translations, defaultLocale } from './locales';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'cosflow-locale';

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Toujours initialiser avec la langue par défaut pour éviter l'hydration mismatch
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isClient, setIsClient] = useState(false);

  // Charger la langue depuis localStorage uniquement côté client
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') {
      setLocaleState(stored);
    }
  }, []);

  const t = getTranslations(locale);

  // Sauvegarder la langue dans localStorage quand elle change
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

// Hook optionnel pour obtenir uniquement les traductions
export function useTranslations() {
  const { t } = useLocale();
  return t;
}
