import { cookies } from 'next/headers';
import { Locale, defaultLocale, getTranslations } from './locales';

const LOCALE_COOKIE_KEY = 'NEXT_LOCALE';

/**
 * Get the current locale from cookies (server-side only)
 */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_KEY)?.value;

  if (locale === 'fr' || locale === 'en') {
    return locale;
  }

  return defaultLocale;
}

/**
 * Get translations for the current locale (server-side only)
 */
export async function getServerTranslations() {
  const locale = await getServerLocale();
  return getTranslations(locale);
}
