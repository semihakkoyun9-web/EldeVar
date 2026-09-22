import React from 'react';

interface EldeVarSealProps {
  className?: string;
  size?: number;
}

/**
 * EldeVar Mühür Logosu (Wax Seal)
 * Görseldeki organik balmumu dalgalı mühür formu, kabartmalı iç çember ve 'EV' monogramı.
 * Kilit simgesi kaldırılmış, mühür içinde EV yazacak şekilde modernize edilmiştir.
 */
export const EldeVarSeal: React.FC<EldeVarSealProps> = ({ className = '', size = 38 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(60, 24, 12, 0.25))' }}
      aria-label="EldeVar EV Mühür Logosu"
    >
      <defs>
        {/* Dış Balmumu Gövdesi Gradyanı */}
        <radialGradient
          id="waxOuterGrad"
          cx="38%"
          cy="32%"
          r="65%"
          fx="35%"
          fy="30%"
        >
          <stop offset="0%" stopColor="#A44D29" />
          <stop offset="35%" stopColor="#8C3A1C" />
          <stop offset="70%" stopColor="#6E2B14" />
          <stop offset="100%" stopColor="#4A1A0B" />
        </radialGradient>

        {/* İç Tabla / Yüzey Gradyanı */}
        <radialGradient
          id="waxInnerPlate"
          cx="42%"
          cy="38%"
          r="55%"
        >
          <stop offset="0%" stopColor="#9C4422" />
          <stop offset="60%" stopColor="#7B3319" />
          <stop offset="100%" stopColor="#541F0E" />
        </radialGradient>

        {/* Kabartma Işık & Gölge Çemberleri */}
        <linearGradient id="ringHighlight" x1="25%" y1="20%" x2="75%" y2="85%">
          <stop offset="0%" stopColor="#C96D46" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#85361A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#381307" stopOpacity="0.95" />
        </linearGradient>

        {/* Yazı Altı Hafif Damga Gölgelendirmesi */}
        <filter id="debossShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#2E0E05" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* 1. DIŞ BALMUMU DALGALI KENAR (12 Organik Boğumlu Mühür Şekli) */}
      <path
        d="M 50 3
           C 56 3, 61 7, 66 7
           C 72 7, 77 4, 82 8
           C 87 12, 86 18, 90 23
           C 94 28, 98 32, 98 38
           C 98 44, 94 48, 95 54
           C 96 60, 99 65, 96 71
           C 93 77, 87 78, 83 83
           C 79 88, 77 94, 71 96
           C 65 98, 60 94, 54 96
           C 48 98, 43 96, 38 96
           C 33 96, 27 98, 22 94
           C 17 90, 18 84, 14 80
           C 10 76, 3 73, 3 67
           C 3 61, 7 56, 6 50
           C 5 44, 2 39, 4 33
           C 6 27, 12 25, 15 20
           C 18 15, 20 8, 26 6
           C 32 4, 37 7, 43 5
           C 46 3, 48 3, 50 3 Z"
        fill="url(#waxOuterGrad)"
      />

      {/* Dış çeper ışık yansıması (Balmumu parlama halkası) */}
      <path
        d="M 28 9 C 40 4, 62 4, 76 10 C 85 14, 92 24, 94 36"
        stroke="#D97E57"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />

      {/* 2. İÇ ÇEMBER KABARTMASI (Mühür Yuvası) */}
      {/* Çukur derinlik gölgesi */}
      <circle
        cx="50"
        cy="51"
        r="34"
        fill="none"
        stroke="#331006"
        strokeWidth="3.5"
        opacity="0.85"
      />

      {/* Kabartma Işıklı Çember Hattı */}
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="url(#waxInnerPlate)"
        stroke="url(#ringHighlight)"
        strokeWidth="2.2"
      />

      {/* İnce iç kontur halkası */}
      <circle
        cx="50"
        cy="50"
        r="31"
        fill="none"
        stroke="#451709"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* 3. MÜHÜR İÇİNDEKİ "EV" MONOGRAMI */}
      <g filter="url(#debossShadow)">
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="#FAF3E8"
          fontSize="27"
          fontFamily="Georgia, 'Playfair Display', serif"
          fontWeight="bold"
          letterSpacing="0.8"
        >
          EV
        </text>
      </g>

      {/* Minik nostaljik altın/kemik pırıltısı */}
      <ellipse
        cx="44"
        cy="36"
        rx="12"
        ry="4"
        fill="#FAF3E8"
        opacity="0.12"
        transform="rotate(-20 44 36)"
      />
    </svg>
  );
};

interface EldeVarBrandProps {
  className?: string;
  sealSize?: number;
  showSlogan?: boolean;
  onClick?: () => void;
}

/**
 * EldeVar Tam Marka Logosu (Mühür + Tipografi + Opsiyonel Slogan)
 */
export const EldeVarBrand: React.FC<EldeVarBrandProps> = ({
  className = '',
  sealSize = 38,
  showSlogan = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`shrink-0 flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
      title="EldeVar - Eski hikâyeler yeni sahibiyle canlanıyor"
    >
      {/* Balmumu Mühür (EV) */}
      <div className="group-hover:scale-105 group-hover:rotate-1 transition-all duration-200">
        <EldeVarSeal size={sealSize} />
      </div>

      {/* Tipografi ve Slogan */}
      <div className="flex flex-col">
        <span className="text-2xl font-serif font-black tracking-tight text-[#1C1917] group-hover:opacity-90 transition-opacity leading-none">
          <span className="text-[#9E4424]">E</span>lde<span className="text-[#9E4424]">V</span>ar
        </span>
        {showSlogan && (
          <span className="text-[10px] text-stone-500 font-sans tracking-tight mt-0.5">
            Eski hikâyeler yeni sahibiyle canlanıyor
          </span>
        )}
      </div>
    </div>
  );
};
