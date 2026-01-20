'use client';

import { LanguageSwitcher } from './language-switcher';

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className="bg-secondary/50 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-white hidden md:block">{title}</h2>

                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 md:ml-auto">
                    <LanguageSwitcher variant="compact" />
                </div>
            </div>
        </header>
    );
}