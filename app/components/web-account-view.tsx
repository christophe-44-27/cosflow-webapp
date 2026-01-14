'use client';

import { Header } from './header';
import { User, Mail, Lock, Bell, Eye, Link, Download, Shield, Settings, Camera } from 'lucide-react';

export function WebAccountView() {
  return (
    <div className="flex-1">
      <Header title="Mon Compte" showSearch={false} />

      <div className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-tertiary rounded-full flex items-center justify-center">
                    <span className="text-white text-3xl">M</span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-secondary">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h3 className="text-white mb-1">Mermaid Fenicia</h3>
                <p className="text-white/60 text-sm mb-4">mermaid@cosflow.app</p>
                <button className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
                  Voir le profil public
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Projets</span>
                  <span className="text-white">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Galeries</span>
                  <span className="text-white">48</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Abonnés</span>
                  <span className="text-white">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Abonnements</span>
                  <span className="text-white">567</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-6">Informations personnelles</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Prénom</label>
                    <input
                      type="text"
                      defaultValue="Mermaid"
                      className="w-full bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Nom</label>
                    <input
                      type="text"
                      defaultValue="Fenicia"
                      className="w-full bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      defaultValue="mermaid@cosflow.app"
                      className="flex-1 bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button className="px-4 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      Vérifier
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">Bio</label>
                  <textarea
                    rows={3}
                    defaultValue="Passionnée de cosplay et de photographie événementielle."
                    className="w-full bg-white/5 text-white rounded-lg px-4 py-3 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors">
                  Sauvegarder les modifications
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-6">Sécurité</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <div className="text-left">
                      <h4 className="text-white">Changer le mot de passe</h4>
                      <p className="text-white/60 text-sm">Dernière modification il y a 3 mois</p>
                    </div>
                  </div>
                  <span className="text-white/40">›</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    <div className="text-left">
                      <h4 className="text-white">Authentification à deux facteurs</h4>
                      <p className="text-white/60 text-sm">Non activée</p>
                    </div>
                  </div>
                  <span className="text-white/40">›</span>
                </button>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-secondary border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-6">Confidentialité</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-white/60" />
                    <div>
                      <h4 className="text-white">Profil public</h4>
                      <p className="text-white/60 text-sm">Votre profil est visible par tous</p>
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
                      <h4 className="text-white">Notifications par email</h4>
                      <p className="text-white/60 text-sm">Recevoir les mises à jour par email</p>
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
              <h3 className="text-white mb-6">Données</h3>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  <div className="text-left">
                    <h4 className="text-white">Exporter mes données</h4>
                    <p className="text-white/60 text-sm">Télécharger une copie de vos informations</p>
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