import React, { useState } from 'react';
import { Lock, KeyRound, X, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminPasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordPromptModal: React.FC<AdminPasswordPromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Password required: eldevar2026
    if (password.trim() === 'eldevar2026') {
      setPassword('');
      onSuccess();
    } else {
      setError('Hatalı yönetici şifresi! Lütfen tekrar deneyiniz.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className={`bg-[#FAF8F5] text-stone-900 w-full max-w-md rounded-3xl border border-[#E8DEC8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#1C1917] to-[#2B2522] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-[#9E4424] text-white flex items-center justify-center shadow-lg mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-serif font-black text-xl tracking-tight">
            Yönetici Doğrulaması
          </h3>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            EldeVar ürün ve görsel kontrol merkezine erişmek için şifrenizi giriniz.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center justify-between">
              <span>Yönetici Şifresi</span>
              <span className="text-[10px] text-stone-400 font-mono">eldevar2026</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoFocus
                placeholder="Şifrenizi giriniz..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-2xl text-sm text-stone-900 focus:outline-hidden focus:border-[#9E4424] focus:ring-2 focus:ring-[#9E4424]/15 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-600 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Giriş Yap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
