# Dictionnaires de traduction Cosflow

Ce répertoire contient les dictionnaires de traduction pour l'application Cosflow en français (FR) et anglais (EN).

## Structure

- `fr.ts` - Dictionnaire français (langue par défaut)
- `en.ts` - Dictionnaire anglais
- `index.ts` - Exports et utilitaires

## Utilisation

### Import simple

```typescript
import { fr, en } from '@/app/lib/locales';

// Utiliser le dictionnaire français
console.log(fr.common.search); // "Rechercher..."

// Utiliser le dictionnaire anglais
console.log(en.common.search); // "Search..."
```

### Avec un helper

```typescript
import { getTranslations } from '@/app/lib/locales';

// Par défaut, retourne le français
const t = getTranslations();
console.log(t.common.search); // "Rechercher..."

// Spécifier une langue
const tEn = getTranslations('en');
console.log(tEn.common.search); // "Search..."
```

### Dans un composant React

```typescript
'use client';

import { useState } from 'react';
import { getTranslations, Locale } from '@/app/lib/locales';

export function MyComponent() {
  const [locale, setLocale] = useState<Locale>('fr');
  const t = getTranslations(locale);

  return (
    <div>
      <h1>{t.landing.welcome}</h1>
      <p>{t.landing.hero.subtitle}</p>

      {/* Sélecteur de langue */}
      <select value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

### Avec Context (recommandé pour une application complète)

Créer un context pour gérer la langue globalement :

```typescript
// app/lib/locale-context.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, getTranslations, Translations } from '@/app/lib/locales';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');
  const t = getTranslations(locale);

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
```

Utilisation dans les composants :

```typescript
'use client';

import { useLocale } from '@/app/lib/locale-context';

export function MyComponent() {
  const { t, locale, setLocale } = useLocale();

  return (
    <div>
      <h1>{t.landing.welcome}</h1>
      <button onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}>
        {locale === 'fr' ? 'English' : 'Français'}
      </button>
    </div>
  );
}
```

## Organisation des traductions

Les traductions sont organisées par section :

- **common** : Textes communs (boutons, labels, etc.)
- **sidebar** : Navigation latérale
- **header** : En-tête de page
- **auth** : Modal d'authentification
- **landing** : Page d'accueil
- **discovery** : Page de découverte
- **gallery** : Galerie publique
- **projects** : Projets publics
- **account** : Page de compte utilisateur
- **pagination** : Pagination

## Ajouter de nouvelles traductions

1. Ajouter la clé et la traduction dans `fr.ts`
2. Ajouter la traduction correspondante dans `en.ts`
3. TypeScript garantira que les deux dictionnaires ont les mêmes clés

Exemple :

```typescript
// Dans fr.ts
export const fr = {
  // ...
  newSection: {
    title: 'Nouveau titre',
    description: 'Nouvelle description',
  },
};

// Dans en.ts
export const en: Translations = {
  // ...
  newSection: {
    title: 'New title',
    description: 'New description',
  },
};
```

## Type Safety

Les dictionnaires sont typés avec TypeScript pour garantir :
- Toutes les clés existent dans les deux langues
- Pas de fautes de frappe dans les clés
- Auto-complétion dans l'IDE

```typescript
const t = getTranslations('fr');
t.common.search // ✅ OK
t.common.notExist // ❌ Erreur TypeScript
```
