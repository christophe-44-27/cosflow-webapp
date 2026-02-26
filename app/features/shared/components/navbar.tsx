'use client';

import { Search, Folder, User, Home, Lock, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/app/lib/locale-context';
import { useAuth } from '@/app/features/auth';
import NextImage from 'next/image';
import { LanguageSwitcher } from '@/app/components/language-switcher';

interface NavbarProps {
    isLoggedIn: boolean;
    onLoginRequired: () => void;
}

export function Navbar({ isLoggedIn, onLoginRequired }: NavbarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const t = useTranslations();
    const { logout, user } = useAuth();
    const userMenuRef = useRef<HTMLDivElement>(null);

    const publicNavItems = [
        { id: 'home', label: t.sidebar.home, icon: Home, href: '/' },
        { id: 'discovery', label: t.sidebar.discovery, icon: Search, href: '/discovery' },
    ];

    const privateNavItems = [
        { id: 'projects', label: t.sidebar.myProjects, icon: Folder, href: '/projects' },
    ];

    const allNavItems = [...publicNavItems, ...privateNavItems];

    const handlePrivateNavClick = (e: React.MouseEvent, isPrivate: boolean) => {
        if (isPrivate && !isLoggedIn) {
            e.preventDefault();
            onLoginRequired();
        } else {
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    // Close user menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isPrivateItem = (id: string) => privateNavItems.some(i => i.id === id);

    return (
        <>
            {/* Main Navbar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-secondary/80 backdrop-blur-md border-b border-white/10 z-50">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center">
                            <NextImage
                                src="/logo.png"
                                alt="Cosflow Logo"
                                width={36}
                                height={36}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-white font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
                            {t.sidebar.appName}
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-1 ml-6">
                        {allNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            const isLocked = isPrivateItem(item.id) && !isLoggedIn;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={(e) => handlePrivateNavClick(e, isPrivateItem(item.id))}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? 'text-white bg-primary/20'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    } ${isLocked ? 'opacity-60' : ''}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                    {isLocked && <Lock className="w-3 h-3 text-white/40" />}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-3">
                        <div className="hidden md:block">
                            <LanguageSwitcher variant="compact" />
                        </div>

                        {/* Logged out: Login button */}
                        {!isLoggedIn ? (
                            <button
                                onClick={onLoginRequired}
                                className="hidden md:flex bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                            >
                                {t.sidebar.login}
                            </button>
                        ) : (
                            /* Logged in: User dropdown */
                            <div className="hidden md:block relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden ring-2 ring-white/10">
                                        {user?.profile?.has_avatar ? (
                                            <NextImage
                                                src={user.profile.avatar}
                                                alt={user.profile.name}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-4 h-4 text-white/60" />
                                        )}
                                    </div>
                                    {user?.profile?.name && (
                                        <span className="text-sm text-white/80 max-w-[120px] truncate">
                                            {user.profile.name}
                                        </span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                        <Link
                                            href="/account"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                                pathname === '/account'
                                                    ? 'text-white bg-primary/20'
                                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <User className="w-4 h-4" />
                                            {t.sidebar.myAccount}
                                        </Link>
                                        <div className="border-t border-white/10" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            {t.sidebar.logout}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile: hamburger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-center text-white rounded-xl hover:bg-white/5 transition-colors"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40 top-16"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="md:hidden fixed top-16 left-0 right-0 bg-secondary border-b border-white/10 z-40 shadow-2xl">
                        <nav className="p-3 space-y-1">
                            {allNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                const isLocked = isPrivateItem(item.id) && !isLoggedIn;

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={(e) => handlePrivateNavClick(e, isPrivateItem(item.id))}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                            isActive
                                                ? 'bg-primary/20 text-white'
                                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                                        } ${isLocked ? 'opacity-60' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        {isLocked && <Lock className="w-4 h-4 text-white/40" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="border-t border-white/10 p-3 space-y-1">
                            {!isLoggedIn ? (
                                <button
                                    onClick={() => { onLoginRequired(); setIsMobileMenuOpen(false); }}
                                    className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                                >
                                    {t.sidebar.login}
                                </button>
                            ) : (
                                <>
                                    {user?.profile && (
                                        <div className="flex items-center gap-3 px-4 py-2 mb-1">
                                            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden ring-2 ring-white/10">
                                                {user.profile.has_avatar ? (
                                                    <NextImage
                                                        src={user.profile.avatar}
                                                        alt={user.profile.name}
                                                        width={36}
                                                        height={36}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-4 h-4 text-white/60" />
                                                )}
                                            </div>
                                            <span className="text-sm text-white font-medium truncate">{user.profile.name}</span>
                                        </div>
                                    )}
                                    <Link
                                        href="/account"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                            pathname === '/account'
                                                ? 'bg-primary/20 text-white'
                                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">{t.sidebar.myAccount}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">{t.sidebar.logout}</span>
                                    </button>
                                </>
                            )}
                            <div className="px-4 pt-1">
                                <LanguageSwitcher variant="compact" />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
