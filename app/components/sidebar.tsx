'use client';

import { Search, Folder, Camera, Settings, User, Home, Image, Calendar, Lock, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '../lib/locale-context';

interface SidebarProps {
    isLoggedIn: boolean;
    onLoginRequired: () => void;
}

export function Sidebar({ isLoggedIn, onLoginRequired }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = useTranslations();

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

    const handlePrivateNavClick = (e: React.MouseEvent, href: string) => {
        if (!isLoggedIn) {
            e.preventDefault();
            onLoginRequired();
        } else {
            setIsMobileMenuOpen(false);
        }
    };

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

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center text-white"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30 mt-16"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 bottom-0 w-64 bg-secondary border-r border-white/10 flex flex-col z-40 transition-transform duration-300 top-16 md:top-0 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                {/* Logo - Desktop Only */}
                <div className="hidden md:block p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-white">{t.sidebar.appName}</h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {/* Public Navigation */}
                    {publicNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* Divider */}
                    <div className="py-2">
                        <div className="border-t border-white/10"></div>
                    </div>

                    {/* Private Navigation */}
                    {privateNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const isLocked = !isLoggedIn;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={(e) => handlePrivateNavClick(e, item.href)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                } ${isLocked ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </div>
                                {isLocked && (
                                    <Lock className="w-4 h-4 text-white/40" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

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
                        bottomItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })
                    )}
                </div>
            </aside>
        </>
    );
}