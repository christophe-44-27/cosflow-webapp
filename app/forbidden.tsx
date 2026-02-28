'use client';

import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import { useTranslations } from './lib/locale-context';

export default function Forbidden() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-[#1E1A40] flex flex-col items-center justify-center px-4 text-center">

      {/* Icône + étoiles */}
      <div className="mb-8 relative w-52 h-52 flex items-center justify-center">

        {/* Étoiles orbitales */}
        <svg width="208" height="208" viewBox="0 0 208 208" fill="none" className="absolute inset-0" aria-hidden="true">
          {/* Anneau pointillé */}
          <circle cx="104" cy="104" r="96" stroke="#6259CA" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 8" />
          {/* Sparkles teal */}
          <path d="M104 10 L105.5 5 L107 10 L112 11.5 L107 13 L105.5 18 L104 13 L99 11.5 Z" fill="#2BD1C7" fillOpacity="0.7" />
          <path d="M194 68 L195 64.5 L196 68 L199.5 69 L196 70 L195 73.5 L194 70 L190.5 69 Z" fill="#2BD1C7" fillOpacity="0.5" />
          <path d="M160 197 L161 194 L162 197 L165 198 L162 199 L161 202 L160 199 L157 198 Z" fill="#2BD1C7" fillOpacity="0.45" />
          {/* Sparkles purple */}
          <path d="M8 104 L9.5 99 L11 104 L16 105.5 L11 107 L9.5 112 L8 107 L3 105.5 Z" fill="#6259CA" fillOpacity="0.7" />
          <path d="M48 10 L49 7 L50 10 L53 11 L50 12 L49 15 L48 12 L45 11 Z" fill="#6259CA" fillOpacity="0.5" />
          <path d="M197 145 L198 142 L199 145 L202 146 L199 147 L198 150 L197 147 L194 146 Z" fill="#6259CA" fillOpacity="0.45" />
          <path d="M18 155 L19 152.5 L20 155 L22.5 156 L20 157 L19 159.5 L18 157 L15.5 156 Z" fill="#2BD1C7" fillOpacity="0.35" />
        </svg>

        {/* Icône centrale */}
        <div className="w-32 h-32 rounded-3xl bg-[#6259CA]/25 border border-[#6259CA]/50 flex items-center justify-center">
          <LockKeyhole className="w-16 h-16 text-[#a5b4fc]" strokeWidth={1.5} />
        </div>
      </div>

      {/* 403 */}
      <p className="text-7xl font-black text-red-500/70 mb-2 tracking-tight">{t.forbidden.code}</p>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-3">
        {t.forbidden.title}
      </h1>

      {/* Description */}
      <p className="text-white/50 max-w-sm mb-8 text-sm leading-relaxed">
        {t.forbidden.description}
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6259CA] text-white font-semibold hover:bg-[#6259CA]/90 transition-colors"
      >
        {t.forbidden.cta}
      </Link>
    </div>
  );
}
