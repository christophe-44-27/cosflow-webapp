'use client';

import { Header } from './header';
import { Lock, Bell, Eye, Download, Shield, Camera, ExternalLink } from 'lucide-react';
import { useAuth } from '@/app/features/auth';
import { SubscriptionSection } from '@/app/features/subscription';
import { useTranslations } from '@/app/lib/locale-context';
import Link from 'next/link';
import Image from 'next/image';

export function WebAccountView() {
  const { user, isLoading } = useAuth();
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">{t.common.loading}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white/60">Non connecté</div>
      </div>
    );
  }

  const { profile } = user;

  console.log(profile);

  return (
    <div className="flex-1">
      <Header title={t.account.title} />

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {profile.has_avatar && profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-tertiary rounded-full flex items-center justify-center">
                      <span className="text-white text-3xl">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-secondary">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h3 className="text-white mb-1">{profile.name}</h3>
                <p className="text-white/60 text-sm mb-4">{user.email}</p>
                <Link
                  href={`/profile/${profile.slug}`}
                  className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                  {t.account.viewPublicProfile}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">{t.account.stats.title}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">{t.account.stats.projects}</span>
                  <span className="text-white">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">{t.account.stats.galleries}</span>
                  <span className="text-white">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">{t.account.stats.followers}</span>
                  <span className="text-white">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">{t.account.stats.following}</span>
                  <span className="text-white">-</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mt-4 text-center">
                Stats coming soon
              </p>
            </div>

            {/* Subscription Section */}
            <SubscriptionSection />

            {/* Profile Completion */}
            {!profile.is_complete && (
              <div className="bg-secondary border border-white/10 rounded-2xl p-6">
                <h3 className="text-white mb-4">Profil</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-white/60">Complétion</span>
                  <span className="text-white">{profile.completion_percentage}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${profile.completion_percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-6">{t.account.personalInfo.title}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    {t.account.personalInfo.name}
                  </label>
                  <input
                      type="text"
                      defaultValue={profile.name}
                      className="w-full bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    {t.account.personalInfo.email}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="flex-1 bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {!user.is_verified && (
                      <button className="px-4 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        {t.account.personalInfo.verify}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    {t.account.personalInfo.bio}
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={profile.description || ''}
                    placeholder="Décrivez-vous en quelques mots..."
                    className="w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors">
                  {t.account.personalInfo.saveChanges}
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-6">{t.account.security.title}</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <div className="text-left">
                      <h4 className="text-white">{t.account.security.changePassword.title}</h4>
                      <p className="text-white/60 text-sm">{t.account.security.changePassword.lastModified}</p>
                    </div>
                  </div>
                  <span className="text-white/40">›</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <div className="text-left">
                      <h4 className="text-white">{t.account.security.twoFactor.title}</h4>
                      <p className="text-white/60 text-sm">{t.account.security.twoFactor.status}</p>
                    </div>
                  </div>
                  <span className="text-white/40">›</span>
                </button>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-6">{t.account.privacy.title}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-white/60" />
                    <div>
                      <h4 className="text-white">{t.account.privacy.publicProfile.title}</h4>
                      <p className="text-white/60 text-sm">{t.account.privacy.publicProfile.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-white/60" />
                    <div>
                      <h4 className="text-white">{t.account.privacy.emailNotifications.title}</h4>
                      <p className="text-white/60 text-sm">{t.account.privacy.emailNotifications.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Data Export */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-6">{t.account.data.title}</h3>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  <div className="text-left">
                    <h4 className="text-white">{t.account.data.export.title}</h4>
                    <p className="text-white/60 text-sm">{t.account.data.export.description}</p>
                  </div>
                </div>
                <span className="text-white/40">›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
