'use client';

import { createContext, useContext, useState, ReactNode, useEffect, startTransition } from 'react';
import { Locale, getTranslations, Translations, defaultLocale } from './locales';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'cosflow-locale';
const LOCALE_COOKIE_KEY = 'NEXT_LOCALE';

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Toujours initialiser avec la locale par défaut pour éviter l'hydration mismatch
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Charger la locale stockée uniquement côté client après l'hydration
  useEffect(() => {
    // Essayer de lire depuis le cookie puis localStorage
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${LOCALE_COOKIE_KEY}=`))
      ?.split('=')[1];

    const stored = cookieLocale || localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') {
      // Utiliser startTransition pour indiquer que c'est une mise à jour non-urgente
      startTransition(() => {
        setLocaleState(stored);
      });
    }
  }, []);

  const t = getTranslations(locale);

  // Sauvegarder la langue dans localStorage et cookie quand elle change
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      // Set cookie with 1 year expiration
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `${LOCALE_COOKIE_KEY}=${newLocale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
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
