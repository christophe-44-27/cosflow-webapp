import { fr } from './fr';
import { en } from './en';

export type Locale = 'fr' | 'en';

export const locales = {
  fr,
  en,
} as const;

export const defaultLocale: Locale = 'fr';

export function getTranslations(locale: Locale = defaultLocale) {
  return locales[locale] || locales[defaultLocale];
}

export { fr, en };
export type { Translations } from './fr';
