'use client';

import Link from 'next/link';
import { useTranslations } from './lib/locale-context';

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-[#1E1A40] flex flex-col items-center justify-center px-4 text-center">

      {/* Illustration SVG */}
      <div className="mb-8 relative">
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Glow background */}
          <circle cx="140" cy="140" r="110" fill="#6259CA" fillOpacity="0.08" />
          <circle cx="140" cy="140" r="80" fill="#6259CA" fillOpacity="0.07" />

          {/* Mannequin body */}
          <ellipse cx="140" cy="210" rx="28" ry="8" fill="#6259CA" fillOpacity="0.3" />
          <rect x="128" y="175" width="24" height="38" rx="4" fill="#2a2550" stroke="#6259CA" strokeWidth="1.5" />
          <rect x="112" y="178" width="16" height="28" rx="8" fill="#2a2550" stroke="#6259CA" strokeWidth="1.5" />
          <rect x="152" y="178" width="16" height="28" rx="8" fill="#2a2550" stroke="#6259CA" strokeWidth="1.5" />

          {/* Neck */}
          <rect x="134" y="158" width="12" height="20" rx="4" fill="#2a2550" stroke="#6259CA" strokeWidth="1.5" />

          {/* Helmet / Mask */}
          <ellipse cx="140" cy="130" rx="42" ry="44" fill="#1a1740" stroke="#6259CA" strokeWidth="2" />
          {/* Helmet top dome */}
          <path d="M98 130 Q98 86 140 86 Q182 86 182 130" fill="#22203d" stroke="#6259CA" strokeWidth="2" />
          {/* Visor */}
          <path
            d="M108 122 Q140 108 172 122 L170 138 Q140 150 110 138 Z"
            fill="#2BD1C7"
            fillOpacity="0.15"
            stroke="#2BD1C7"
            strokeWidth="1.5"
          />
          {/* Visor reflection */}
          <path d="M115 117 Q130 111 148 114" stroke="#2BD1C7" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />

          {/* Question marks on visor */}
          <text x="128" y="136" fontSize="16" fontWeight="bold" fill="#2BD1C7" fillOpacity="0.8" fontFamily="monospace">?</text>
          <text x="146" y="136" fontSize="16" fontWeight="bold" fill="#2BD1C7" fillOpacity="0.8" fontFamily="monospace">?</text>

          {/* Helmet details */}
          <rect x="126" y="168" width="28" height="4" rx="2" fill="#6259CA" fillOpacity="0.5" />
          <circle cx="108" cy="130" r="5" fill="#6259CA" fillOpacity="0.4" stroke="#6259CA" strokeWidth="1" />
          <circle cx="172" cy="130" r="5" fill="#6259CA" fillOpacity="0.4" stroke="#6259CA" strokeWidth="1" />

          {/* Stars / sparkles */}
          <g fill="#2BD1C7">
            <path d="M52 80 L54 74 L56 80 L62 82 L56 84 L54 90 L52 84 L46 82 Z" fillOpacity="0.7" />
            <path d="M220 60 L221.5 55 L223 60 L228 61.5 L223 63 L221.5 68 L220 63 L215 61.5 Z" fillOpacity="0.5" />
            <path d="M68 185 L69 182 L70 185 L73 186 L70 187 L69 190 L68 187 L65 186 Z" fillOpacity="0.4" />
          </g>
          <g fill="#6259CA">
            <path d="M230 160 L231.5 155 L233 160 L238 161.5 L233 163 L231.5 168 L230 163 L225 161.5 Z" fillOpacity="0.6" />
            <path d="M42 140 L43 137 L44 140 L47 141 L44 142 L43 145 L42 142 L39 141 Z" fillOpacity="0.5" />
          </g>

          {/* Floating search icon */}
          <g transform="translate(190, 76)">
            <circle cx="14" cy="14" r="10" stroke="#6259CA" strokeWidth="2" fill="none" />
            <line x1="21" y1="21" x2="28" y2="28" stroke="#6259CA" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* 404 */}
      <p className="text-7xl font-black text-[#6259CA] mb-2 tracking-tight">{t.notFound.code}</p>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-3">
        {t.notFound.title}
      </h1>

      {/* Description */}
      <p className="text-white/50 max-w-sm mb-8 text-sm leading-relaxed">
        {t.notFound.description}
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6259CA] text-white font-semibold hover:bg-[#6259CA]/90 transition-colors"
      >
        {t.notFound.cta}
      </Link>
    </div>
  );
}
