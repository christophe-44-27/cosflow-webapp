'use client';

import { Search, Bell, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { LanguageSwitcher } from './language-switcher';
import { useTranslations } from '../lib/locale-context';

interface HeaderProps {
    title: string;
    showSearch?: boolean;
    showAddButton?: boolean;
}

export function Header({ title, showSearch = true, showAddButton = false }: HeaderProps) {
    const { isLoggedIn, handleLogout } = useAuth();
    const t = useTranslations();
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
                                placeholder={t.common.search}
                                className="bg-white/10 text-white placeholder:text-white/60 rounded-lg py-2 pl-10 pr-4 w-80 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    )}

                    <LanguageSwitcher variant="compact" />

                    {showAddButton && isLoggedIn && (
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">{t.common.new}</span>
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

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded-xl"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{t.sidebar.logout}</span>
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