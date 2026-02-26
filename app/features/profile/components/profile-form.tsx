'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/features/auth';
import { useProfileUpdate } from '../hooks/use-profile-update';
import { useCurrenciesAndCountries } from '../hooks/use-currencies-and-countries';
import { useLocale } from '@/app/lib/locale-context';

const LANGUAGES = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
];

export function ProfileForm() {
  const { user } = useAuth();
  const { updateProfile, isUpdating } = useProfileUpdate();
  const { currencies, countries, isLoading: isLoadingOptions } = useCurrenciesAndCountries();
  const { t, setLocale: updateAppLocale } = useLocale();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currencyId, setCurrencyId] = useState<string>('');
  const [countryId, setCountryId] = useState<string>('');
  const [locale, setLocale] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      const currId = user.profile?.currency?.id?.toString() || '';
      const cntryId = user.profile?.country?.id?.toString() || '';


      setName(user.profile?.name || '');
      setEmail(user.email || '');
      setCurrencyId(currId);
      setCountryId(cntryId);
      setLocale(user.profile?.locale || 'fr');
    }
  }, [user, currencies.length, countries.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only send fields that have changed
    const updates: {
      name?: string;
      email?: string;
      currency_id?: number;
      country_id?: number;
      locale?: string;
    } = {};

    const localeChanged = locale !== user?.profile?.locale;

    if (name !== user?.profile?.name) {
      updates.name = name;
    }
    if (email !== user?.email) {
      updates.email = email;
    }
    if (currencyId !== '' && currencyId !== user?.profile?.currency?.id?.toString()) {
      updates.currency_id = parseInt(currencyId);
    }
    if (countryId !== '' && countryId !== user?.profile?.country?.id?.toString()) {
      updates.country_id = parseInt(countryId);
    }
    if (localeChanged) {
      updates.locale = locale;
    }

    const success = await updateProfile(updates);

    // Si la mise à jour a réussi et que la langue a changé, mettre à jour l'interface
    if (success && localeChanged && (locale === 'fr' || locale === 'en')) {
      updateAppLocale(locale);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-white/60 text-sm mb-2 block">
          {t.account.personalInfo.name}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          required
        />
      </div>

      <div>
        <label className="text-white/60 text-sm mb-2 block">
          {t.account.personalInfo.email}
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-white/60 text-sm mb-2 block">
          Devise
        </label>
        <select
          value={currencyId}
          onChange={(e) => setCurrencyId(e.target.value)}
          className="w-full bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          disabled={isLoadingOptions}
        >
          <option value="">Sélectionner une devise</option>
          {currencies.map((currency) => (
            <option key={currency.id} value={currency.id.toString()}>
              {currency.code_iso} - {currency.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-white/60 text-sm mb-2 block">
          Pays
        </label>
        <select
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
          className="w-full bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          disabled={isLoadingOptions}
        >
          <option value="">Sélectionner un pays</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id.toString()}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-white/60 text-sm mb-2 block">
          Langue
        </label>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="w-full bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUpdating ? 'Enregistrement...' : t.account.personalInfo.saveChanges}
      </button>
    </form>
  );
}
