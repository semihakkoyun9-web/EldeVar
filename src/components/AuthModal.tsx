import React, { useState } from 'react';
import { 
  X, Mail, Lock, User, MapPin, Eye, EyeOff, CheckCircle2, 
  ShieldCheck, Sparkles, ArrowRight, Store, AlertCircle, LogIn, UserPlus 
} from 'lucide-react';
import { AuthUser, DEFAULT_AUTH_USER } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'register';
  triggerReason?: 'create_listing' | 'general' | 'offer' | 'memory_box';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  triggerReason = 'general',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [accountType, setAccountType] = useState<'seller' | 'buyer'>('seller');
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Lütfen e-posta adresinizi ve şifrenizi giriniz.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // If email matches demo user
      if (email.toLowerCase().includes('semih')) {
        onLoginSuccess(DEFAULT_AUTH_USER);
      } else {
        const newUser: AuthUser = {
          id: `usr-${Date.now()}`,
          name: name || email.split('@')[0],
          username: email.split('@')[0].toLowerCase(),
          email: email,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: accountType,
          isVerified: true,
          memberSince: 'Eylül 2026',
          rating: 5.0,
          successfulSales: 0,
          city: city || 'İstanbul',
          availableBalance: 0,
          pendingBalance: 0,
        };
        onLoginSuccess(newUser);
      }
      onClose();
    }, 700);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }
    if (!agreeTerms) {
      setError('Lütfen üyelik sözleşmesini onaylayınız.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const registeredUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: name,
        username: email.split('@')[0].toLowerCase(),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        city: city || 'İstanbul',
        role: accountType,
        isVerified: true,
        memberSince: 'Eylül 2026',
        rating: 5.0,
        successfulSales: 0,
        bio: `${accountType === 'seller' ? 'Koleksiyoner & İkinci El Satıcısı' : 'Vintage Sever'}`,
        availableBalance: 0,
        pendingBalance: 0,
      };
      onLoginSuccess(registeredUser);
      onClose();
    }, 850);
  };

  const handleGoogleLogin = () => {
    setError(null);
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      const googleUser: AuthUser = {
        id: 'usr-google-semih',
        name: 'Semih Akkoyun',
        username: 'semihakkoyun',
        email: 'semihakkoyun9@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        city: 'Eskişehir / Kadıköy',
        iban: 'TR12 0001 0090 1234 5678 5001',
        bio: "90'lar vintage giyim, analog vizörler ve yaşanmışlığı olan eşyalar koleksiyoneri.",
        role: 'seller',
        isVerified: true,
        memberSince: 'Eylül 2024',
        rating: 4.9,
        successfulSales: 16,
        availableBalance: 2420.0,
        pendingBalance: 570.0,
      };
      onLoginSuccess(googleUser);
      onClose();
    }, 900);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(DEFAULT_AUTH_USER);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Background Pattern */}
        <div className="relative bg-gradient-to-r from-[#2D2620] via-[#1C1917] to-[#382F26] p-6 text-white text-center select-none">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* EV Seal Badge */}
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#9E4424] text-[#FAF5ED] font-serif font-black flex items-center justify-center text-xl shadow-lg ring-4 ring-white/10">
            EV
          </div>

          <h2 className="text-xl font-serif font-bold tracking-tight text-[#FAF5ED]">
            EldeVar Hesabı
          </h2>
          <p className="text-xs text-[#E8DCCB] mt-1 font-sans">
            Eski hikâyeler yeni sahibiyle canlanıyor
          </p>

          {/* Trigger Context Warning */}
          {triggerReason === 'create_listing' && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-[#9E4424]/30 border border-[#9E4424]/50 flex items-center gap-2 text-left">
              <Store className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="text-[11px] leading-tight text-white">
                <span className="font-bold text-amber-200">İlan Verebilmek İçin: </span>
                Kendi vintage eşyanızı ilana koyup Hafıza Pasaportu oluşturmak için lütfen oturum açın.
              </div>
            </div>
          )}
        </div>

        {/* Tab Switcher: Oturum Aç / Kayıt Ol */}
        <div className="flex border-b border-[#E8E2D8] bg-[#FAF8F5]">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              mode === 'login'
                ? 'border-[#9E4424] text-[#9E4424] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Oturum Aç</span>
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              mode === 'register'
                ? 'border-[#9E4424] text-[#9E4424] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Kayıt Ol</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. GOOGLE İLE GİRİŞ BUTONU */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:scale-[0.99] text-stone-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer group"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-[#9E4424] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Google ile Hızlı Giriş Yap</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-[11px] text-stone-400 font-medium">veya e-posta ile</span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          {/* FORM: LOGIN */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  E-Posta Adresi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@posta.com veya semihakkoyun9@gmail.com"
                    className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424] focus:ring-2 focus:ring-[#9E4424]/10 transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Şifre
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')}
                    className="text-[11px] text-[#9E4424] hover:underline"
                  >
                    Şifremi Unuttum?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424] focus:ring-2 focus:ring-[#9E4424]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Giriş Yap</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* FORM: REGISTER */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ad Soyad *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Semih Akkoyun"
                    className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424] focus:ring-2 focus:ring-[#9E4424]/10 transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  E-Posta Adresi *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@posta.com"
                    className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424] focus:ring-2 focus:ring-[#9E4424]/10 transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Şehir / İlçe
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kadıköy, İst."
                      className="w-full bg-[#FAF8F5] text-stone-800 text-xs pl-8 pr-2.5 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Şifre Oluştur *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full bg-[#FAF8F5] text-stone-800 text-xs pl-8 pr-2.5 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                </div>
              </div>

              {/* Hesap Türü */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Hesap Tercihi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('seller')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      accountType === 'seller'
                        ? 'border-[#9E4424] bg-[#FAF4ED] text-[#9E4424] font-bold ring-1 ring-[#9E4424]'
                        : 'border-[#E4DDCF] text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5" />
                      <span>Koleksiyoner / Satıcı</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-0.5">İlan ver & sat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('buyer')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      accountType === 'buyer'
                        ? 'border-[#9E4424] bg-[#FAF4ED] text-[#9E4424] font-bold ring-1 ring-[#9E4424]'
                        : 'border-[#E4DDCF] text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Alıcı / Meraklı</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-0.5">Keşfet & topla</span>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 pt-1 text-xs text-stone-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#9E4424] focus:ring-[#9E4424]"
                />
                <span className="text-[11px] leading-tight">
                  <span className="underline">Kullanıcı Sözleşmesi</span> ve <span className="underline">KVKK Aydınlatma Metni</span>'ni okudum, kabul ediyorum.
                </span>
              </label>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Kayıt Ol ve Mağaza Aç</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-stone-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-semibold text-stone-500 hover:text-[#9E4424] flex items-center justify-center gap-1.5 mx-auto py-1.5 px-3 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Hızlı Test Girişi (Semih Akkoyun olarak gir)</span>
            </button>
          </div>

          {/* Security & Peace of Mind Badge */}
          <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              256-Bit SSL Koruma
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Doğrulanmış Üyelik
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
