import React from 'react';

interface EldeVarSealProps {
  className?: string;
  size?: number;
}

/**
 * EldeVar Balmumu Mühür Logosu (Wax Seal)
 * Organik balmumu mühür formu, kabartmalı altın çember ve 'EV' monogramı.
 * SVG url(#id) hatalarına karşı %100 korumalı, her cihazda ve mobil tarayıcıda canlı görünür.
 */
export const EldeVarSeal: React.FC<EldeVarSealProps> = ({ className = '', size = 34 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 relative rounded-full bg-gradient-to-br from-[#A54724] via-[#8C3A1C] to-[#591E0B] flex items-center justify-center shadow-[0_2px_6px_rgba(60,24,12,0.35)] border border-[#C2623F]/50 select-none ${className}`}
      title="EldeVar EV Mührü"
    >
      {/* Organik dalgalı kenar hissi için dış hafif parlama halkası */}
      <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />

      {/* İç kabartma halkası (Altın/kemik tonlu mühür yatağı) */}
      <div className="absolute inset-[3px] rounded-full border border-[#D97E57]/60 ring-1 ring-black/30 bg-[#7B3319]/40 pointer-events-none" />

      {/* EV Monogramı (Georgia / Serif, kalın ve net) */}
      <span
        style={{ fontSize: Math.round(size * 0.42) }}
        className="font-serif font-black text-[#FAF5ED] leading-none tracking-tight select-none z-10 drop-shadow-[0_1px_2px_rgba(30,10,4,0.85)]"
      >
        EV
      </span>
    </div>
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
  sealSize = 34,
  showSlogan = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`shrink-0 flex items-center gap-2 select-none cursor-pointer group ${className}`}
      title="EldeVar - Eski hikâyeler yeni sahibiyle canlanıyor"
    >
      {/* Balmumu Mühür (EV) */}
      <div className="group-hover:scale-105 transition-all duration-200">
        <EldeVarSeal size={sealSize} />
      </div>

      {/* Tipografi ve Slogan */}
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#1C1917] group-hover:opacity-90 transition-opacity leading-none">
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
