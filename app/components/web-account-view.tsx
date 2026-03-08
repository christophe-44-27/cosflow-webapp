'use client';

import { useState } from 'react';

import { Lock, Bell, Eye, Download, Shield, Camera, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/app/features/auth';
import { SubscriptionSection } from '@/app/features/subscription';
import { useTranslations } from '@/app/lib/locale-context';
import { ChangePasswordModal } from '@/app/features/auth/components/change-password-modal';
import { AvatarUploadModal, CoverUploadModal, ProfileForm } from '@/app/features/profile';
import Link from 'next/link';
import Image from 'next/image';

export function WebAccountView() {
  const { user, isLoading } = useAuth();
  const t = useTranslations();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isAvatarUploadModalOpen, setIsAvatarUploadModalOpen] = useState(false);
  const [isCoverUploadModalOpen, setIsCoverUploadModalOpen] = useState(false);

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
        <div className="text-white/60">{t.account.notConnected}</div>
      </div>
    );
  }

  const { profile } = user;


  return (
    <div className="flex-1">
      <div className="py-4 md:py-8">
        {/* Cover Image Section */}
        <div className="mb-6">
          <div className="relative w-full aspect-[2.6/1] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-tertiary/20 border border-white/10 group">
            {profile.has_cover && profile.cover ? (
              <Image
                src={profile.cover}
                alt="Cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-white/20" />
              </div>
            )}
            <button
              onClick={() => setIsCoverUploadModalOpen(true)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div className="bg-primary rounded-full p-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
          </div>
        </div>

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
                  <button
                    onClick={() => setIsAvatarUploadModalOpen(true)}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center border-4 border-secondary transition-colors"
                  >
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

            {/* Subscription Section */}
            <SubscriptionSection />

            {/* Profile Completion */}
            {!profile.is_complete && (
              <div className="bg-secondary border border-white/10 rounded-2xl p-6">
                <h3 className="text-white mb-4">{t.account.profileSection}</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-white/60">{t.account.profileCompletion}</span>
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
              <ProfileForm />
            </div>

            {/* Security Settings */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-6">{t.account.security.title}</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <div className="text-left">
                      <h4 className="text-white">{t.account.security.changePassword.title}</h4>
                      <p className="text-white/60 text-sm">{t.account.security.changePassword.lastModified}</p>
                    </div>
                  </div>
                  <span className="text-white/40">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccess={() => {
          setIsChangePasswordModalOpen(false);
        }}
      />

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={isAvatarUploadModalOpen}
        onClose={() => setIsAvatarUploadModalOpen(false)}
        currentAvatar={profile.avatar}
        hasAvatar={profile.has_avatar}
      />

      {/* Cover Upload Modal */}
      <CoverUploadModal
        isOpen={isCoverUploadModalOpen}
        onClose={() => setIsCoverUploadModalOpen(false)}
        currentCover={profile.cover}
        hasCover={profile.has_cover}
      />
    </div>
  );
}
