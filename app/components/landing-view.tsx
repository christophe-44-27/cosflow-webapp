'use client';

import { Header } from './header';
import { Camera, Users, Image, Calendar, Zap, Shield, Star, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '@/app/features/auth';
import { useTranslations } from '../lib/locale-context';

export function LandingView() {
    const { setShowAuthModal } = useAuth();
    const t = useTranslations();
    const IOS_STORE_URL = 'https://testflight.apple.com/join/JcPbtVrN';
    const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=co.cosflow.app';
    const DISCORD_URL = 'https://discord.gg/p5NvbQ7p';

    const features = [
        {
            icon: Camera,
            title: t.landing.features.projectManagement.title,
            description: t.landing.features.projectManagement.description,
            color: 'from-primary to-primary/80',
        },
        {
            icon: Image,
            title: t.landing.features.publicOrPrivate.title,
            description: t.landing.features.publicOrPrivate.description,
            color: 'from-tertiary to-tertiary/80',
        },
        {
            icon: Calendar,
            title: t.landing.features.events.title,
            description: t.landing.features.events.description,
            color: 'from-primary to-tertiary',
        },
        {
            icon: Users,
            title: t.landing.features.collaboration.title,
            description: t.landing.features.collaboration.description,
            color: 'from-tertiary to-primary',
            comingSoon: true,
        },
    ];

    const benefits = t.landing.benefits.list;

    return (
        <div className="min-h-screen">
            <Header title={t.landing.welcome} />

            <div className="overflow-hidden pt-20 md:pt-0">
                {/* Hero Section */}
                <section className="relative px-6 md:px-8 pt-6 md:pt-20 pb-6 md:pb-0">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8 md:mb-16">
                            <h1 className="text-white text-4xl md:text-6xl mb-3 md:mb-6">
                                {t.landing.whatIs} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Cosflow</span> ?
                            </h1>
                            <p className="text-white/70 text-base md:text-xl max-w-2xl mx-auto mb-6 md:mb-8">
                                {t.landing.hero.subtitle}
                            </p>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="bg-gradient-to-r from-primary to-tertiary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl hover:shadow-2xl hover:shadow-primary/30 transition-all text-base md:text-lg inline-flex items-center gap-2"
                            >
                                {t.landing.hero.cta}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="px-6 md:px-8 py-8 md:py-20">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-white text-3xl md:text-4xl text-center mb-10 md:mb-16">
                            {t.landing.features.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="group bg-secondary border border-white/10 rounded-2xl p-8 hover:border-primary/50 transition-all cursor-pointer relative"
                                    >
                                        {feature.comingSoon && (
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-tertiary px-3 py-1 rounded-full">
                                                <span className="text-white text-xs font-medium">{t.landing.features.comingSoon}</span>
                                            </div>
                                        )}
                                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-white text-xl mb-3">{feature.title}</h3>
                                        <p className="text-white/70 leading-relaxed">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="px-4 md:px-8 py-12 md:py-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8 md:mb-16">
                            <h2 className="text-white text-2xl md:text-4xl mb-4">
                                {t.landing.howItWorks.title}
                            </h2>
                            <p className="text-white/70 text-lg md:text-xl">
                                {t.landing.howItWorks.subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-primary text-2xl">1</span>
                                </div>
                                <h3 className="text-white text-xl mb-3">{t.landing.howItWorks.step1.title}</h3>
                                <p className="text-white/70">
                                    {t.landing.howItWorks.step1.description}
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-tertiary/10 border-2 border-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-tertiary text-2xl">2</span>
                                </div>
                                <h3 className="text-white text-xl mb-3">{t.landing.howItWorks.step2.title}</h3>
                                <p className="text-white/70">
                                    {t.landing.howItWorks.step2.description}
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-primary text-2xl">3</span>
                                </div>
                                <h3 className="text-white text-xl mb-3">{t.landing.howItWorks.step3.title}</h3>
                                <p className="text-white/70">
                                    {t.landing.howItWorks.step3.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="px-4 md:px-8 py-12 md:py-20 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                            <div>
                                <h2 className="text-white text-2xl md:text-4xl mb-4 md:mb-6">
                                    {t.landing.benefits.title}
                                </h2>
                                <p className="text-white/70 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                                    {t.landing.benefits.subtitle}
                                </p>

                                <div className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-tertiary flex-shrink-0" />
                                            <span className="text-white/90 text-sm md:text-base">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-4 md:space-y-6">
                                    <div className="bg-secondary border border-white/10 rounded-2xl p-4 md:p-6">
                                        <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary mb-3 md:mb-4" />
                                        <h4 className="text-white mb-2">{t.landing.benefits.ultraFast.title}</h4>
                                        <p className="text-white/70 text-xs md:text-sm">
                                            {t.landing.benefits.ultraFast.description}
                                        </p>
                                    </div>

                                    <div className="bg-secondary border border-white/10 rounded-2xl p-4 md:p-6">
                                        <Shield className="w-6 h-6 md:w-8 md:h-8 text-tertiary mb-3 md:mb-4" />
                                        <h4 className="text-white mb-2">{t.landing.benefits.secure.title}</h4>
                                        <p className="text-white/70 text-xs md:text-sm">
                                            {t.landing.benefits.secure.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 md:space-y-6 mt-6 md:mt-12">
                                    <div className="bg-secondary border border-white/10 rounded-2xl p-4 md:p-6">
                                        <Users className="w-6 h-6 md:w-8 md:h-8 text-primary mb-3 md:mb-4" />
                                        <h4 className="text-white mb-2">{t.landing.benefits.community.title}</h4>
                                        <p className="text-white/70 text-xs md:text-sm">
                                            {t.landing.benefits.community.description}
                                        </p>
                                    </div>

                                    <div className="bg-secondary border border-white/10 rounded-2xl p-4 md:p-6">
                                        <Star className="w-6 h-6 md:w-8 md:h-8 text-tertiary mb-3 md:mb-4" />
                                        <h4 className="text-white mb-2">{t.landing.benefits.free.title}</h4>
                                        <p className="text-white/70 text-xs md:text-sm">
                                            {t.landing.benefits.free.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-4 md:px-8 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-tertiary rounded-2xl md:rounded-3xl p-8 md:p-12 text-center">
                            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full -mr-16 md:-mr-32 -mt-16 md:-mt-32" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-white/10 rounded-full -ml-24 md:-ml-48 -mb-24 md:-mb-48" />

                            <div className="relative">
                                <h2 className="text-white text-2xl md:text-4xl mb-3 md:mb-4">
                                    {t.landing.cta.title}
                                </h2>
                                <p className="text-white/90 text-base md:text-xl mb-6 md:mb-8">
                                    {t.landing.cta.subtitle}
                                </p>

                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl text-base md:text-lg"
                                >
                                    <span>{t.landing.cta.button}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                <p className="text-white/80 text-xs md:text-sm mt-4 md:mt-6">
                                    {t.landing.cta.footer}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Store and Discord Links */}
                <section className="px-4 md:px-8 py-12 md:py-20 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8 md:mb-16">
                            <h2 className="text-white text-2xl md:text-4xl mb-4">
                                {t.landing.mobile.title}
                            </h2>
                            <p className="text-white/70 text-base md:text-xl">
                                {t.landing.mobile.subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                            {/* App Store */}
                            <div className="bg-secondary border border-white/10 rounded-2xl p-8 text-center h-full flex flex-col">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-tertiary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="white"/>
                                    </svg>
                                </div>
                                <h3 className="text-white text-xl mb-3">{t.landing.mobile.appStore}</h3>
                                <p className="text-white/60 mb-6 flex-grow">{t.landing.mobile.appStoreDesc}</p>
                                <a
                                    href={IOS_STORE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary/20"
                                >
                                    {t.landing.mobile.download}
                                </a>
                            </div>

                            {/* Play Store */}
                            <div className="bg-secondary border border-white/10 rounded-2xl p-8 text-center hover:border-primary/50 transition-all h-full flex flex-col">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" fill="white"/>
                                    </svg>
                                </div>
                                <h3 className="text-white text-xl mb-3">{t.landing.mobile.googlePlay}</h3>
                                <p className="text-white/60 mb-6 flex-grow">{t.landing.mobile.googlePlayDesc}</p>
                                <a
                                    href={PLAY_STORE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary/20"
                                >
                                    {t.landing.mobile.download}
                                </a>
                            </div>

                            {/* Discord */}
                            <div className="bg-secondary border border-white/10 rounded-2xl p-8 text-center hover:border-primary/50 transition-all h-full flex flex-col">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#5865F2] to-[#5865F2]/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" fill="white"/>
                                    </svg>
                                </div>
                                <h3 className="text-white text-xl mb-3">{t.landing.mobile.discord}</h3>
                                <p className="text-white/60 mb-6 flex-grow">{t.landing.mobile.discordDesc}</p>
                                <a
                                    href={DISCORD_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white px-6 py-3 rounded-lg transition-all shadow-lg shadow-[#5865F2]/20"
                                >
                                    {t.landing.mobile.join}
                                </a>
                            </div>
                        </div>

                        {/* Extra Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-16">
                            <div className="bg-secondary/50 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Smartphone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-white mb-2">{t.landing.mobile.autoSync.title}</h4>
                                    <p className="text-white/70 text-sm">
                                        {t.landing.mobile.autoSync.description}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-secondary/50 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                                <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-tertiary" />
                                </div>
                                <div>
                                    <h4 className="text-white mb-2">{t.landing.mobile.communitySupport.title}</h4>
                                    <p className="text-white/70 text-sm">
                                        {t.landing.mobile.communitySupport.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}