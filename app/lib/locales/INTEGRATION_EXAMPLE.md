# Exemple d'intégration des traductions

Ce fichier montre comment intégrer le système de traduction dans vos composants existants.

## 1. Envelopper l'application avec le LocaleProvider

Dans `app/layout.tsx` ou `app/components/app-client-wrapper.tsx` :

```typescript
import { LocaleProvider } from './lib/locale-context';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
```

## 2. Exemple : Modifier le composant Header

**AVANT (texte en dur)** :

```typescript
// app/components/header.tsx
'use client';

import { Search, Bell, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

interface HeaderProps {
    title: string;
    showSearch?: boolean;
    showAddButton?: boolean;
}

export function Header({ title, showSearch = true, showAddButton = false }: HeaderProps) {
    const { isLoggedIn, handleLogout } = useAuth();
    return (
        <header className="bg-secondary/50 backdrop-blur-sm border-b border-white/10 px-4 md:px-8 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
                <h2 className="text-white hidden md:block">{title}</h2>

                <div className="flex items-center gap-4 md:ml-auto">
                    {showSearch && (
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                            <input
                                type="text"
                                placeholder="Rechercher..."  {/* ⬅️ Texte en dur */}
                                className="bg-white/10 text-white placeholder:text-white/60 rounded-lg py-2 pl-10 pr-4 w-80"
                            />
                        </div>
                    )}

                    {showAddButton && isLoggedIn && (
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg">
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">Nouveau</span>  {/* ⬅️ Texte en dur */}
                        </button>
                    )}

                    {isLoggedIn && (
                        <>
                            <button className="relative p-2 hover:bg-white/5 rounded-lg">
                                <Bell className="w-5 h-5 text-white" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full"></span>
                            </button>

                            <div className="relative group">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-tertiary rounded-full flex items-center justify-center cursor-pointer">
                                    <span className="text-white">M</span>
                                </div>

                                <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded-xl"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Déconnexion</span>  {/* ⬅️ Texte en dur */}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
```

**APRÈS (avec traductions)** :

```typescript
// app/components/header.tsx
'use client';

import { Search, Bell, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useTranslations } from '../lib/locale-context';  // ⬅️ Import du hook

interface HeaderProps {
    title: string;
    showSearch?: boolean;
    showAddButton?: boolean;
}

export function Header({ title, showSearch = true, showAddButton = false }: HeaderProps) {
    const { isLoggedIn, handleLogout } = useAuth();
    const t = useTranslations();  // ⬅️ Obtenir les traductions

    return (
        <header className="bg-secondary/50 backdrop-blur-sm border-b border-white/10 px-4 md:px-8 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
                <h2 className="text-white hidden md:block">{title}</h2>

                <div className="flex items-center gap-4 md:ml-auto">
                    {showSearch && (
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                            <input
                                type="text"
                                placeholder={t.common.search}  {/* ✅ Utilisation de la traduction */}
                                className="bg-white/10 text-white placeholder:text-white/60 rounded-lg py-2 pl-10 pr-4 w-80 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    )}

                    {showAddButton && isLoggedIn && (
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">{t.common.new}</span>  {/* ✅ Utilisation de la traduction */}
                        </button>
                    )}

                    {isLoggedIn && (
                        <>
                            <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-white" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full"></span>
                            </button>

                            <div className="relative group">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-tertiary rounded-full flex items-center justify-center cursor-pointer">
                                    <span className="text-white">M</span>
                                </div>

                                <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded-xl"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{t.sidebar.logout}</span>  {/* ✅ Utilisation de la traduction */}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
```

## 3. Ajouter le sélecteur de langue dans le Header

Vous pouvez ajouter le composant `LanguageSwitcher` dans votre Header :

```typescript
import { LanguageSwitcher } from './language-switcher';

export function Header({ title, showSearch = true, showAddButton = false }: HeaderProps) {
    const { isLoggedIn, handleLogout } = useAuth();
    const t = useTranslations();

    return (
        <header className="...">
            <div className="flex items-center justify-between">
                <h2 className="text-white hidden md:block">{title}</h2>

                <div className="flex items-center gap-4 md:ml-auto">
                    {/* ... autres éléments ... */}

                    {/* Ajouter le sélecteur de langue */}
                    <LanguageSwitcher variant="compact" />

                    {/* ... reste du code ... */}
                </div>
            </div>
        </header>
    );
}
```

## 4. Exemple : Modifier le Sidebar

**Changements dans sidebar.tsx** :

```typescript
'use client';

import { useTranslations } from '../lib/locale-context';

export function Sidebar({ isLoggedIn, onLoginRequired }: SidebarProps) {
    const t = useTranslations();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const publicNavItems = [
        { id: 'home', label: t.sidebar.home, icon: Home, href: '/' },
        { id: 'discovery', label: t.sidebar.discovery, icon: Search, href: '/discovery' },
    ];

    const privateNavItems = [
        { id: 'gallery', label: t.sidebar.myGallery, icon: Image, href: '/gallery' },
        { id: 'projects', label: t.sidebar.myProjects, icon: Folder, href: '/projects' },
        { id: 'events', label: t.sidebar.events, icon: Calendar, href: '/events' },
        { id: 'forge', label: t.sidebar.forge, icon: Settings, href: '/forge' },
    ];

    const bottomItems = [
        { id: 'account', label: t.sidebar.myAccount, icon: User, href: '/account', private: true },
    ];

    // ... reste du code ...

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-secondary border-b border-white/10 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-white">{t.sidebar.appName}</h1>
                </div>
                {/* ... */}
            </div>

            {/* ... reste du composant avec les traductions ... */}

            {/* Bottom Navigation */}
            <div className="p-4 border-t border-white/10 space-y-2">
                {!isLoggedIn ? (
                    <button
                        onClick={onLoginRequired}
                        className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-xl transition-colors"
                    >
                        {t.sidebar.login}
                    </button>
                ) : (
                    {/* ... */}
                )}
            </div>
        </>
    );
}
```

## 5. Tester les traductions

Après avoir intégré le système de traduction :

1. Le sélecteur de langue apparaîtra dans votre Header
2. Cliquez dessus pour basculer entre Français et Anglais
3. Tous les textes de l'interface se mettront à jour instantanément
4. La langue choisie sera sauvegardée dans localStorage

## Notes importantes

- **Performance** : Le hook `useTranslations()` est optimisé et ne provoque pas de re-render inutiles
- **Type Safety** : TypeScript vous avertira si vous utilisez une clé de traduction inexistante
- **Fallback** : Si une traduction n'existe pas, le système utilise automatiquement le français (langue par défaut)
- **SSR Compatible** : Le système fonctionne avec le Server-Side Rendering de Next.js
