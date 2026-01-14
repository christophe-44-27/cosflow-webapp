'use client';

import { useLocale } from '../lib/locale-context';
import { Locale } from '../lib/locales';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  if (variant === 'compact') {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Globe className="w-5 h-5 text-white" />
          <span className="text-white text-sm">
            {languages.find((lang) => lang.code === locale)?.flag}
          </span>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                locale === lang.code
                  ? 'bg-primary text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.label}</span>
              {locale === lang.code && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            locale === lang.code
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="text-lg">{lang.flag}</span>
          <span className="text-sm">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
