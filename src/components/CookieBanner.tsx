import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, Shield } from 'lucide-react';

interface CookieBannerProps {
  onOpenCookiePolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenCookiePolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('eldevar_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('eldevar_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('eldevar_cookie_consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E2D8] shadow-2xl text-stone-800 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-sm">
            <div className="p-1.5 rounded-lg bg-[#FAF3EB] text-[#9E4424] border border-[#EBD4BF]">
              <Cookie className="w-4 h-4" />
            </div>
            <span>Çerez ve Gizlilik Tercihleri</span>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed font-sans">
          EldeVarMı, güvenli bir alışveriş deneyimi sunmak, oturumunuzu açık tutmak ve sürdürülebilirlik etkisini analiz etmek için 6698 sayılı KVKK kapsamında çerezler kullanır.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto flex-1 py-2 px-3 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Tümünü Kabul Et</span>
          </button>

          <button
            onClick={onOpenCookiePolicy}
            className="w-full sm:w-auto py-2 px-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-white text-stone-700 text-xs font-medium transition-all cursor-pointer text-center"
          >
            <span>Detayları İncele</span>
          </button>
        </div>
      </div>
    </div>
  );
};
