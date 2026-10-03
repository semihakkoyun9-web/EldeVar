import React, { useState } from 'react';
import { 
  User, Store, Package, Heart, Tag, ShieldCheck, FileText, Feather, Check, 
  ChevronRight, BookOpen, Cookie, HelpCircle, MapPin, Truck, CreditCard, 
  Building2, Banknote, LogIn, UserPlus, LogOut, Lock, Mail, AlertCircle, 
  Sparkles, CheckCircle2, Eye, EyeOff
} from 'lucide-react';
import { Order, UserPreferences, Product, ProductOffer, AuthUser, DEFAULT_AUTH_USER } from '../types';
import { UserStoreView } from './UserStoreView';

interface MenuViewProps {
  customerEmail: string;
  sellerEmail: string;
  orders: Order[];
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
  onOpenSellerModal: () => void;
  onNavigateHome: () => void;
  onOpenContact?: () => void;
  onOpenFaq?: () => void;
  userProducts?: Product[];
  onDeleteProduct?: (productId: string) => void;
  offers?: ProductOffer[];
  onAcceptOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
  onOpenMemoryBox?: () => void;
  currentUser?: AuthUser | null;
  onLoginSuccess?: (user: AuthUser) => void;
  onLogout?: () => void;
  onOpenAuthModal?: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  customerEmail,
  sellerEmail,
  orders,
  preferences,
  onUpdatePreferences,
  onOpenSellerModal,
  onNavigateHome,
  onOpenContact,
  onOpenFaq,
  userProducts = [],
  onDeleteProduct,
  offers = [],
  onAcceptOffer,
  onRejectOffer,
  onOpenMemoryBox,
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenAuthModal,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // Auth Form State when not logged in
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCity, setAuthCity] = useState('');
  const [authAccountType, setAuthAccountType] = useState<'seller' | 'buyer'>('seller');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clothing & Shoe sizes
  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const availableBrands = ["Levi's", "Burberry", "Vakko", "Dr. Martens", "Sony", "Yashica", "Dual Germany", "Apple", "Schott NYC", "Mid-Century"];

  const toggleBrand = (b: string) => {
    const current = preferences.favoriteBrands || [];
    const updated = current.includes(b) ? current.filter((x) => x !== b) : [...current, b];
    onUpdatePreferences({ ...preferences, favoriteBrands: updated });
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authEmail || !authPassword) {
      setAuthError('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      if (authEmail.toLowerCase().includes('semih')) {
        onLoginSuccess?.(DEFAULT_AUTH_USER);
      } else {
        const user: AuthUser = {
          id: `usr-${Date.now()}`,
          name: authEmail.split('@')[0],
          username: authEmail.split('@')[0].toLowerCase(),
          email: authEmail,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: authAccountType,
          isVerified: true,
          memberSince: 'Eylül 2026',
          rating: 5.0,
          successfulSales: 0,
          city: authCity || 'İstanbul',
          availableBalance: 0,
          pendingBalance: 0,
        };
        onLoginSuccess?.(user);
      }
    }, 600);
  };

  const handleInlineRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authName || !authEmail || !authPassword) {
      setAuthError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      const user: AuthUser = {
        id: `usr-${Date.now()}`,
        name: authName,
        username: authEmail.split('@')[0].toLowerCase(),
        email: authEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        city: authCity || 'İstanbul',
        role: authAccountType,
        isVerified: true,
        memberSince: 'Eylül 2026',
        rating: 5.0,
        successfulSales: 0,
        availableBalance: 0,
        pendingBalance: 0,
      };
      onLoginSuccess?.(user);
    }, 700);
  };

  const handleGoogleInlineLogin = () => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      onLoginSuccess?.(DEFAULT_AUTH_USER);
    }, 800);
  };

  if (isStoreOpen) {
    return (
      <UserStoreView
        onBack={() => setIsStoreOpen(false)}
        onOpenSellerModal={onOpenSellerModal}
        userProducts={userProducts}
        onDeleteProduct={onDeleteProduct}
        orders={orders}
        offers={offers}
        onAcceptOffer={onAcceptOffer}
        onRejectOffer={onRejectOffer}
        onOpenMemoryBox={onOpenMemoryBox}
        currentUser={currentUser}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      {/* 1. KULLANICI PROFİLİ VEYA GİRİŞ KARTI */}
      {!currentUser ? (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D8] overflow-hidden relative">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#FAF3EB] text-[#9E4424] font-serif font-black flex items-center justify-center text-2xl border-2 border-[#EBD7BF] shadow-xs">
                EV
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
                EldeVar'a Hoş Geldiniz
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                Kendi eşyalarınızı ilana koymak, teklif masasında pazarlık yapmak ve Eşya Hatıra Kutusu'nu saklamak için lütfen oturum açın.
              </p>
            </div>

            {/* Google İle Giriş */}
            <button
              onClick={handleGoogleInlineLogin}
              disabled={isAuthLoading}
              className="w-full py-3 px-4 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 active:scale-[0.99] text-stone-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer mb-4"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google Hesabı ile Hızlı Giriş Yap</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-[11px] text-stone-400 font-medium">veya e-posta ile</span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            {/* Switch Mode: Oturum Aç / Kayıt Ol */}
            <div className="flex rounded-xl bg-stone-100 p-1 mb-4">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-[#9E4424] shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Oturum Aç
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'register' ? 'bg-white text-[#9E4424] shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Kayıt Ol (Yeni Mağaza)
              </button>
            </div>

            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleInlineLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    E-Posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="semihakkoyun9@gmail.com"
                      className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
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

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-3 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer mt-2"
                >
                  {isAuthLoading ? (
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
              <form onSubmit={handleInlineRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ad Soyad *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Semih Akkoyun"
                      className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
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
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="ornek@posta.com"
                      className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      value={authCity}
                      onChange={(e) => setAuthCity(e.target.value)}
                      placeholder="Kadıköy, İst."
                      className="w-full bg-[#FAF8F5] text-stone-800 text-xs px-3 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Şifre *
                    </label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full bg-[#FAF8F5] text-stone-800 text-xs px-3 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-3 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer mt-2"
                >
                  {isAuthLoading ? (
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

            {/* Quick Demo Button */}
            <div className="mt-4 pt-3 border-t border-stone-100 text-center">
              <button
                type="button"
                onClick={() => onLoginSuccess?.(DEFAULT_AUTH_USER)}
                className="text-xs font-semibold text-stone-600 hover:text-[#9E4424] flex items-center justify-center gap-1.5 mx-auto py-1 px-3 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tek Tıkla Hızlı Test Girişi (Semih Akkoyun Olarak Giriş Yap)</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* GİRİŞ YAPMIŞ KULLANICI PROFİLİ */
        <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#E8E2D8]">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-full bg-[#FAF3E8] text-[#9E4424] font-serif font-bold flex items-center justify-center text-xl border-2 border-[#EBD7BF] shadow-xs overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-[#1C1917]">
                    {currentUser.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {currentUser.role === 'seller' ? 'Onaylı Üye & Satıcı' : 'Koleksiyoner'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5 font-sans">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-stone-500 block">Kayıtlı Şehir</span>
                <span className="text-xs font-semibold text-stone-800">{currentUser.city || 'Eskişehir / Kadıköy'}</span>
              </div>
              {onLogout && (
                <button
                  onClick={() => {
                    if (window.confirm('Oturumunuz kapatılacaktır. Devam etmek istiyor musunuz?')) {
                      onLogout();
                    }
                  }}
                  className="py-1.5 px-3 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Güvenli Çıkış"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Çıkış Yap</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Button: Mağazama Git & Hatıra Kutusu */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsStoreOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              <Store className="w-4 h-4 text-amber-200" />
              <span>Dokan Satıcı Mağazam & İlanlarım</span>
            </button>

            {onOpenMemoryBox && (
              <button
                onClick={onOpenMemoryBox}
                className="flex-1 py-3 px-4 rounded-xl bg-[#FAF3EB] hover:bg-[#F3E5D3] text-[#8C3F23] border border-[#EBD4BF] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                <span className="text-base">🧳</span>
                <span>Eşya Hatıra Kutusu & Emanet Sandığı</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* 2. ELDEVAR HİKÂYESİ & MANİFESTO BANNER */}
      <section
        onClick={() => setActiveLegalModal('about')}
        className="bg-gradient-to-br from-[#FAF5EE] to-[#F3EAD9] rounded-2xl p-5 border border-[#E5DAC8] shadow-xs cursor-pointer hover:border-[#9E4424] transition-all group"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#9E4424]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E4424]">
                Manifesto & Felsefe
              </span>
            </div>
            <h3 className="font-serif font-bold text-base text-[#1C1917] group-hover:text-[#9E4424] transition-colors">
              "Eski hikâyeler yeni sahibiyle canlanıyor."
            </h3>
            <p className="text-xs text-stone-600 max-w-xl font-sans leading-relaxed">
              Her eşyanın bir geçmişi, hatırası ve ruhu vardır. EldeVar'da ürünler seri imalat nesneler değil, özenle saklanmış yaşam izleridir.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 group-hover:text-[#9E4424] transition-all shrink-0 mt-2" />
        </div>
      </section>

      {/* 3. GEÇMİŞ SİPARİŞLERİM (Kural 12: Farklı ödeme yöntemleriyle en az 3 test siparişi) */}
      <section className="bg-white rounded-2xl p-5 border border-[#E8E2D8] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1] mb-3">
          <h3 className="font-serif font-bold text-[#1C1917] text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-[#9E4424]" />
            <span>Siparişlerim & Satın Alımlarım</span>
            <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-full border border-stone-200">
              {orders.length} Sipariş
            </span>
          </h3>
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            3 Farklı WooCommerce Ödeme Yöntemi Test Edildi
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#FAF8F5] text-center text-xs text-stone-500 border border-[#EFE9DF]">
            Henüz verilmiş bir siparişiniz bulunmuyor. Pazaryerindeki eşyalara göz atabilirsiniz.
          </div>
        ) : (
          <div className="space-y-3.5">
            {orders.map((ord) => {
              // Status configuration
              let statusLabel = 'Ödeme Bekliyor';
              let statusBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';

              if (ord.status === 'completed') {
                statusLabel = 'Teslim Edildi (Tamamlandı)';
                statusBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
              } else if (ord.status === 'shipped') {
                statusLabel = 'Kargoya Verildi';
                statusBadgeClass = 'bg-blue-100 text-blue-900 border-blue-300';
              } else if (ord.status === 'processing') {
                statusLabel = 'Hazırlanıyor (Onaylandı)';
                statusBadgeClass = 'bg-indigo-100 text-indigo-900 border-indigo-300';
              }

              return (
                <div key={ord.id} className="p-4 rounded-2xl border border-[#E8E2D8] bg-[#FAF8F5] space-y-2.5">
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {ord.orderNumber}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        {new Date(ord.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeClass}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200/80 space-y-1.5">
                    <div className="font-medium text-stone-900">
                      {ord.items.map((i) => `${i.product.title} (x${i.quantity})`).join(', ')}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] pt-1.5 border-t border-stone-100 gap-2">
                      <div className="flex items-center gap-1.5 text-stone-600">
                        {ord.paymentMethod === 'bacs' && <Building2 className="w-3.5 h-3.5 text-amber-700" />}
                        {ord.paymentMethod === 'cod' && <Truck className="w-3.5 h-3.5 text-emerald-700" />}
                        {ord.paymentMethod === 'credit_card' && <CreditCard className="w-3.5 h-3.5 text-blue-700" />}
                        <span>Ödeme Yöntemi: <strong>{ord.paymentMethodTitle || (ord.paymentMethod === 'bacs' ? 'Banka Havalesi' : ord.paymentMethod === 'cod' ? 'Kapıda Ödeme' : 'Kredi Kartı')}</strong></span>
                      </div>

                      <div className="text-stone-900 font-bold font-sans">
                        Toplam Tutar: <span className="text-sm text-[#9E4424]">{ord.total.toLocaleString('tr-TR')} TL</span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking & Bank Info Details */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    {ord.trackingNumber && (
                      <span className="inline-flex items-center gap-1 text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-mono">
                        <Truck className="w-3 h-3" />
                        <span>Kargo Takip: {ord.trackingNumber}</span>
                      </span>
                    )}

                    {ord.bankDetails && ord.status === 'pending_payment' && (
                      <span className="text-stone-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Havale Açıklaması: <code className="font-mono font-bold text-amber-900">{ord.bankDetails.descriptionCode}</code>
                      </span>
                    )}

                    <div className="text-[10px] text-stone-500 flex items-center gap-1 ml-auto">
                      <Feather className="w-3 h-3 text-[#9E4424]" />
                      <span>Satıcının el yazısı hatıra kartı kutuya iliştirildi.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. MARKA VE BEDENİM (Kişiselleştirme Alanı) */}
      <section className="bg-white rounded-2xl p-5 border border-[#E8E2D8] shadow-xs space-y-4">
        <div>
          <h3 className="font-serif font-bold text-[#1C1917] text-sm flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#9E4424]" />
            <span>Marka ve Beden Tercihlerim</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            İkinci el akışınızda size uygun beden ve markalardaki hikâyeleri önceliklendirir.
          </p>
        </div>

        {/* Giyim Bedenim */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">Giyim Bedenim</label>
          <div className="flex flex-wrap gap-1.5">
            {clothingSizes.map((sz) => {
              const isSelected = preferences.clothingSize === sz;
              return (
                <button
                  key={sz}
                  onClick={() => onUpdatePreferences({ ...preferences, clothingSize: sz })}
                  className={`w-10 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#9E4424] text-white border-[#9E4424] shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ayakkabı Numaram */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">Ayakkabı Numaram</label>
          <div className="flex flex-wrap gap-1.5">
            {shoeSizes.map((num) => {
              const isSelected = preferences.shoeSize === num;
              return (
                <button
                  key={num}
                  onClick={() => onUpdatePreferences({ ...preferences, shoeSize: num })}
                  className={`w-10 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#9E4424] text-white border-[#9E4424] shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favori Markalar */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">Takip Ettiğim Markalar</label>
          <div className="flex flex-wrap gap-1.5">
            {availableBrands.map((b) => {
              const isSelected = preferences.favoriteBrands?.includes(b);
              return (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#9E4424] text-white border-[#9E4424] font-semibold'
                      : 'bg-[#FAF8F5] text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{b}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. KURUMSAL VE YASAL SAYFALAR (Kural 7 ve Kural 8 Tam Uyumluluğu) */}
      <section className="bg-white rounded-2xl p-5 border border-[#E8E2D8] shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-[#1C1917] text-sm flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kurumsal ve Yasal Bilgilendirme</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* İletişim (Form ve Harita) */}
          <button
            onClick={onOpenContact}
            className="p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9E4424]" />
              <span>İletişim & Harita (Destek Formu)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* Sıkça Sorulan Sorular */}
          <button
            onClick={onOpenFaq}
            className="p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Sıkça Sorulan Sorular (S.S.S.)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* Hakkımızda */}
          <button
            onClick={() => setActiveLegalModal('about')}
            className="p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Hakkımızda: EldeVar Felsefesi</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* Çerez Politikası */}
          <button
            onClick={() => setActiveLegalModal('cookies')}
            className="p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[#9E4424]" />
              <span>Çerez Politikası (Cookie Policy)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* KVKK */}
          <button
            onClick={() => setActiveLegalModal('privacy')}
            className="p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>KVKK Aydınlatma Metni & Gizlilik</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* Mesafeli Satış */}
          <button
            onClick={() => setActiveLegalModal('sales')}
            className="p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Mesafeli Satış Sözleşmesi (C2C)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* İade Koşulları */}
          <button
            onClick={() => setActiveLegalModal('returns')}
            className="p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-600" />
              <span>İade ve Cayma Koşulları</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* Dokan Çok Satıcılı Komisyon Politikası */}
          <button
            onClick={() => setActiveLegalModal('dokan')}
            className="p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" />
              <span>Dokan Pazaryeri & %10 Komisyon Tanımı</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>
      </section>

      {/* Legal Content Modal Popup */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl shadow-2xl border border-[#E4D8C4] overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in">
            <div className="bg-white border-b border-[#E8E2D8] px-5 py-3.5 flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#1C1917]">
                {activeLegalModal === 'about' && 'EldeVar Hikâyesi & Manifesto'}
                {activeLegalModal === 'privacy' && 'KVKK Aydınlatma Metni'}
                {activeLegalModal === 'cookies' && 'Çerez (Cookie) Politikası'}
                {activeLegalModal === 'sales' && 'Mesafeli Satış Sözleşmesi'}
                {activeLegalModal === 'returns' && 'İade ve Cayma Koşulları'}
                {activeLegalModal === 'dokan' && 'Dokan Lite Pazaryeri & Komisyon Yapısı'}
              </span>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs text-stone-700 space-y-3.5 leading-relaxed font-sans">
              {activeLegalModal === 'about' && (
                <>
                  <h4 className="font-serif font-bold text-base text-[#1C1917]">
                    "Eski hikâyeler yeni sahibiyle canlanıyor."
                  </h4>
                  <p className="italic font-serif text-[#9E4424] bg-[#FAF3E8] p-3 rounded-xl border border-[#EBD7BF]">
                    Bizde eşyalar yalnızca birer ticari meta değildir; her ceketin omzunda bir konserin, her analog vizörde bir seyahatin, her lambaderde gece yarılarının tanıklığı vardır.
                  </p>
                  <p>
                    EldeVar, seri üretilmiş nesnelerin yerine hafızası olan eşyaları yeni sahipleriyle buluşturur. Her siparişte satıcı el yazısıyla hazırladığı hatıra kartını pakete iliştirir. Böylece satın aldığınız her ürün, hayatınıza yeni bir hikâye katar ve gezegenimize karbon tasarrufu sağlar.
                  </p>
                </>
              )}

              {activeLegalModal === 'cookies' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">EldeVar Çerez (Cookie) Politikası</h4>
                  <p>
                    EldeVar platformu ("Web Sitesi"), kullanıcı deneyimini iyileştirmek, sepet durumunu korumak, oturum güvenliğini sağlamak ve site trafiğini analiz etmek amacıyla çerezler (cookies) kullanmaktadır.
                  </p>
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-stone-200">
                    <div>
                      <strong className="text-stone-900 block font-semibold">1. Zorunlu Çerezler:</strong>
                      <span>Sepet içeriği, oturum doğrulaması ve ödeme güvenliğinin çalışması için şarttır; kapatılamaz.</span>
                    </div>
                    <div>
                      <strong className="text-stone-900 block font-semibold">2. İşlevsel Çerezler:</strong>
                      <span>Kullanıcının beden ve marka tercihlerini (localStorage) hatırlayarak kişiselleştirilmiş vitrin sunar.</span>
                    </div>
                    <div>
                      <strong className="text-stone-900 block font-semibold">3. Analitik Çerezler:</strong>
                      <span>Karbon tasarrufu hesaplamaları ve ziyaretçi trafiğini anonim olarak ölçümlemek amacıyla işlenir.</span>
                    </div>
                  </div>
                  <p>
                    Dilediğiniz zaman tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz.
                  </p>
                </>
              )}

              {activeLegalModal === 'privacy' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">EldeVar Gizlilik Politikası & KVKK</h4>
                  <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, EldeVar C2C Pazaryeri platformu üzerinden
                    toplanan kullanıcı verileri (Ad, Soyad, E-posta, Telefon, Teslimat Adresi) yalnızca siparişin yerine getirilmesi,
                    kargo süreçlerinin takibi ve Havale/EFT teyidi amacıyla güvenli sunucularda işlenmektedir.
                  </p>
                  <p>
                    Kullanıcılarımızın açık rızası olmadan veriler üçüncü taraf reklam ağlarıyla paylaşılmaz.
                  </p>
                </>
              )}

              {activeLegalModal === 'sales' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">Mesafeli Satış Sözleşmesi (C2C)</h4>
                  <p>
                    İşbu sözleşme, Alıcı ile platformda ilan açan Satıcı arasında akdedilmiştir.
                    EldeVar, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca "Aracı Hizmet Sağlayıcı" konumundadır.
                  </p>
                  <p>
                    Ödeme bedeli, Alıcı ürünü teslim alıp sistem üzerinden onay verene kadar EldeVar havuz güvence hesabında muhafaza edilir.
                  </p>
                </>
              )}

              {activeLegalModal === 'returns' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">İade ve Cayma Hakkı Şartları</h4>
                  <p>
                    İkinci el ürünlerin doğası gereği, ürün satıcının ilanında belirttiği görsel ve kondisyon özellikleriyle birebir
                    uyuşuyorsa keyfi iade kabul edilmemektedir. Ancak üründe ilanda belirtilmeyen gizli kusur, yırtık, sahtelik veya
                    çalışmama durumu tespit edilirse, teslimattan itibaren 48 saat içinde kargo tutanağı ile iade talebi başlatılabilir.
                  </p>
                </>
              )}

              {activeLegalModal === 'dokan' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">Dokan Lite Pazaryeri & %10 Komisyon Modeli</h4>
                  <p>
                    EldeVar, WordPress Dokan Lite altyapısıyla desteklenen çok satıcılı (C2C) bir ikinci el pazaryeridir.
                  </p>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-950 space-y-1.5">
                    <strong>Komisyon Oranı Tanımı:</strong>
                    <p>
                      Platformumuzda başarılı gerçekleşen her satıştan <strong>%10 Platform Komisyonu</strong> kesilir. 
                      Kalan %90 tutar, alıcı teslimat onayını verdikten sonra satıcının tanımlı IBAN hesabına aktarılır.
                    </p>
                  </div>
                  <p>
                    Komisyon gelirleri; güvenli havuz altyapısı, anlaşmalı kargo indirimleri ve döngüsel ekonomi doğa fonu için harcanır.
                  </p>
                </>
              )}
            </div>
            <div className="p-3 bg-white border-t border-[#E8E2D8] text-right">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 bg-[#9E4424] text-white rounded-xl text-xs font-semibold hover:bg-[#85361A] cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
