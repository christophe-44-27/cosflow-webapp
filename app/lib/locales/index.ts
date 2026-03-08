import { fr } from './fr';
import { en } from './en';
import { de } from './de';

export type Locale = 'fr' | 'en' | 'de';

export const locales = {
  fr,
  en,
  de,
} as const;

export const defaultLocale: Locale = 'fr';

export function getTranslations(locale: Locale = defaultLocale) {
  return locales[locale] || locales[defaultLocale];
}

export { fr, en, de };
export type { Translations } from './fr';
