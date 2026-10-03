import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Share2, MoreVertical, Bell, Plus, ChevronRight, 
  TrendingUp, ShoppingBag, Wallet, Sparkles, Tag, CheckCircle2,
  AlertCircle, Package, ExternalLink, ShieldCheck, Heart, Users, Eye, 
  Trash2, Edit3, X, Check, Copy, ArrowUpRight, Clock, Star, MapPin, 
  Phone, Building2, CreditCard, Flame, Award, LogOut
} from 'lucide-react';
import { Product, Order, ProductOffer, AuthUser } from '../types';

interface UserStoreViewProps {
  onBack: () => void;
  onOpenSellerModal: () => void;
  userProducts?: Product[];
  onDeleteProduct?: (productId: string) => void;
  orders?: Order[];
  offers?: ProductOffer[];
  onAcceptOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
  onOpenMemoryBox?: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onUpdateUser?: (updated: AuthUser) => void;
}

export const UserStoreView: React.FC<UserStoreViewProps> = ({
  onBack,
  onOpenSellerModal,
  userProducts = [],
  onDeleteProduct,
  orders = [],
  offers = [],
  onAcceptOffer,
  onRejectOffer,
  onOpenMemoryBox,
  currentUser,
  onLogout,
  onUpdateUser,
}) => {
  // Tab State
  const [activeSubTab, setActiveSubTab] = useState<'magazam' | 'urunlerim' | 'teklifler' | 'onecikar'>('magazam');

  // Profile State (User can actually edit these!)
  const [displayName, setDisplayName] = useState(currentUser?.name || 'Semih Akkoyun');
  const [username, setUsername] = useState(currentUser?.username || 'semihakkoyun');
  const [email, setEmail] = useState(currentUser?.email || 'semihakkoyun9@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '0532 555 44 33');
  const [city, setCity] = useState(currentUser?.city || 'Eskişehir / Kadıköy');
  const [iban, setIban] = useState(currentUser?.iban || 'TR12 0001 0090 1234 5678 5001');
  const [bio, setBio] = useState(currentUser?.bio || '90\'lar vintage giyim, analog vizörler ve yaşanmışlığı olan eşyalar koleksiyoneri.');
  
  // Wallet & Finance
  const [availableBalance, setAvailableBalance] = useState(currentUser?.availableBalance ?? 2420.00);
  const [pendingBalance, setPendingBalance] = useState(currentUser?.pendingBalance ?? 570.00);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.name);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.iban) setIban(currentUser.iban);
      if (currentUser.bio) setBio(currentUser.bio);
      if (currentUser.availableBalance !== undefined) setAvailableBalance(currentUser.availableBalance);
      if (currentUser.pendingBalance !== undefined) setPendingBalance(currentUser.pendingBalance);
    }
  }, [currentUser]);

  // Modals & Drawers
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Boost feature state
  const [boostedProductIds, setBoostedProductIds] = useState<string[]>([]);

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyStoreLink = () => {
    navigator.clipboard?.writeText(`https://eldevar.local/magaza/@${username}`);
    showToast('✅ Mağaza bağlantısı panoya kopyalandı!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
    showToast('✨ Profil ve mağaza ayarlarınız kaydedildi!');
  };

  const handleWithdrawFunds = () => {
    if (availableBalance <= 0) {
      showToast('⚠️ Çekilebilir bakiye bulunmamaktadır.');
      return;
    }
    const amount = availableBalance;
    setAvailableBalance(0);
    showToast(`💸 ${amount.toLocaleString('tr-TR')} TL IBAN hesabınıza aktarılmak üzere işleme alındı!`);
  };

  const handleBoostProduct = (productId: string) => {
    if (boostedProductIds.includes(productId)) {
      showToast('Bu ürün zaten vitrinde öne çıkarılmış durumda!');
      return;
    }
    setBoostedProductIds((prev) => [...prev, productId]);
    showToast('🚀 Ürün 3 gün boyunca vitrinde en üst sıraya sabitlendi!');
  };

  // Aggregated Stats
  const totalViews = userProducts.reduce((acc, p) => acc + (p.views || 45), 280);
  const totalLikes = userProducts.reduce((acc, p) => acc + (p.likes || 12), 48);
  const salesCount = orders.length > 0 ? orders.length : 3;

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen pb-24 text-stone-800">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-stone-700 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ÜST GEZİNME VE İŞLEM ÇUBUĞU */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        <button
          onClick={onBack}
          className="p-2 -ml-1 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
          title="Menüye Dön"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          <span className="text-xs font-bold hidden sm:inline">Geri</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hatıra Kutusu Button */}
          {onOpenMemoryBox && (
            <button
              onClick={onOpenMemoryBox}
              className="py-1.5 px-3 rounded-xl bg-[#FAF3EB] hover:bg-[#F3E5D3] text-[#8C3F23] border border-[#EBD4BF] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Eşya Hatıra Kutusu"
            >
              <span>🧳</span>
              <span className="hidden sm:inline">Hatıra Kutusu</span>
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleCopyStoreLink}
            className="p-2 text-stone-600 hover:text-[#9E4424] hover:bg-[#FAF3EB] rounded-full transition-colors cursor-pointer"
            title="Mağaza Bağlantısını Kopyala"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-stone-600 hover:text-[#9E4424] hover:bg-[#FAF3EB] rounded-full transition-colors cursor-pointer"
              title="Satıcı Bildirimleri"
            >
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#9E4424] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
              3
            </span>

            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#E8E2D8] p-3 text-xs space-y-2 z-40 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-bold text-stone-900">Mağaza Bildirimleri</span>
                  <span className="text-[10px] text-stone-400">3 yeni</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px]">Siparişiniz Teslim Edildi</strong>
                      <span className="text-[10px] text-emerald-800">#EV-84210 alıcıya ulaştı ve bakiye hesabınıza yansıdı.</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-950 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px]">Kargoya Verilmeyi Bekliyor</strong>
                      <span className="text-[10px] text-amber-800">#EV-84211 için Yurtiçi Kargo kodunuz hazır.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* More Menu (...) */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              title="Seçenekler"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E8E2D8] py-1.5 text-xs z-40 animate-in fade-in">
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                >
                  <Edit3 className="w-4 h-4 text-[#9E4424]" />
                  <span>Mağaza Ayarlarını Düzenle</span>
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsWalletModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                >
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>Dokan Cüzdan & IBAN</span>
                </button>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    handleCopyStoreLink();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                >
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Mağaza Linkini Paylaş</span>
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      if (window.confirm('EldeVar hesabınızdan çıkış yapmak istediğinize emin misiniz?')) {
                        onLogout();
                        onBack();
                      }
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 border-t border-stone-100 mt-1 cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Oturumu Kapat (Çıkış)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Sign Out Button in Header */}
          {onLogout && (
            <button
              onClick={() => {
                if (window.confirm('EldeVar hesabınızdan çıkış yapmak istediğinize emin misiniz?')) {
                  onLogout();
                  onBack();
                }
              }}
              className="py-1 px-2.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Güvenli Çıkış Yap"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-5 space-y-4">
        
        {/* 2. PROFİL KARTI VE GERÇEK BİLGİLER */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D8] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Avatar & Kullanıcı Bilgileri */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#9E4424] via-[#C85D35] to-[#F29E6D] p-0.5 shadow-xs flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-bold font-serif text-[#9E4424]">
                    {displayName.charAt(0)}
                  </div>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#9E4424] hover:bg-[#85361A] text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer transition-transform active:scale-90"
                  title="Profili Düzenle"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 tracking-tight">
                    {displayName}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Dokan Onaylı Satıcı</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>%99 Kondisyon Doğruluğu</span>
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono mt-0.5">@{username} • {email}</p>
                <p className="text-xs text-stone-600 mt-1 font-sans line-clamp-1 italic">
                  "{bio}"
                </p>
              </div>
            </div>

            {/* Hızlı İlan Ekle Butonu */}
            <button
              onClick={onOpenSellerModal}
              className="py-2.5 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Yeni İlan Ver</span>
            </button>
          </div>

          {/* İstatistik Çizelgesi */}
          <div className="mt-5 pt-4 border-t border-[#F0EBE1] grid grid-cols-4 divide-x divide-stone-200 text-center">
            <div 
              onClick={() => setIsSalesModalOpen(true)}
              className="px-1 cursor-pointer hover:bg-stone-50 rounded-lg py-1 transition-colors"
            >
              <span className="block text-base sm:text-lg font-bold text-stone-900 leading-tight">{salesCount}</span>
              <span className="text-[11px] text-stone-500 font-medium">Satış</span>
            </div>
            <div className="px-1 py-1">
              <span className="block text-base sm:text-lg font-bold text-stone-900 leading-tight">141</span>
              <span className="text-[11px] text-stone-500 font-medium">Takipçi</span>
            </div>
            <div className="px-1 py-1">
              <span className="block text-base sm:text-lg font-bold text-stone-900 leading-tight">38</span>
              <span className="text-[11px] text-stone-500 font-medium">Takip</span>
            </div>
            <div 
              onClick={() => setIsPerformanceModalOpen(true)}
              className="px-1 cursor-pointer hover:bg-stone-50 rounded-lg py-1 transition-colors"
            >
              <span className="block text-base sm:text-lg font-bold text-stone-900 leading-tight">{totalLikes}</span>
              <span className="text-[11px] text-stone-500 font-medium">Favori</span>
            </div>
          </div>

          {/* Kondisyon Doğruluk & Güven Rozeti (Çözüm 4) */}
          <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-[#FAF8F5] to-emerald-50/60 border border-emerald-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 text-[11px] block">
                  %99 Kondisyon Doğruluk Oranı (16 Satışta 0 İade/İtiraz)
                </span>
                <span className="text-[10px] text-stone-500">
                  İlanlarınızda paylaştığınız detay ve kusur kontrol listeleri alıcı güveni sağlıyor.
                </span>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-md border border-emerald-200">
              Kusursuz Satıcı
            </span>
          </div>

          {/* ÇALIŞAN "Profil Detayı [YENİ]" BUTONU */}
          <div className="mt-4">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E8E2D8] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#9E4424] group-hover:scale-110 transition-transform" />
              <span>Profil ve Mağaza Bilgilerimi Düzenle</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#E53935] text-white text-[9px] font-extrabold uppercase tracking-tight">
                GÜNCELLE
              </span>
            </button>
          </div>
        </div>

        {/* 3. SEKMELER: Mağazam | Ürünlerim | Teklifler | Öne Çıkar */}
        <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
          <div className="grid grid-cols-4 border-b border-[#E8E2D8] text-center text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('magazam')}
              className={`py-3.5 transition-colors cursor-pointer relative ${
                activeSubTab === 'magazam'
                  ? 'text-[#9E4424] font-extrabold bg-[#FAF8F5]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className="hidden sm:inline">Mağazam & Finans</span>
              <span className="sm:hidden">Mağazam</span>
              {activeSubTab === 'magazam' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4424]" />
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('urunlerim')}
              className={`py-3.5 transition-colors cursor-pointer relative ${
                activeSubTab === 'urunlerim'
                  ? 'text-[#9E4424] font-extrabold bg-[#FAF8F5]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>İlanlarım ({userProducts.length})</span>
              {activeSubTab === 'urunlerim' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4424]" />
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('teklifler')}
              className={`py-3.5 transition-colors cursor-pointer relative ${
                activeSubTab === 'teklifler'
                  ? 'text-[#9E4424] font-extrabold bg-[#FAF8F5]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Teklifler ({offers.filter(o => o.status === 'pending').length})</span>
              </span>
              {activeSubTab === 'teklifler' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4424]" />
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('onecikar')}
              className={`py-3.5 transition-colors cursor-pointer relative ${
                activeSubTab === 'onecikar'
                  ? 'text-[#9E4424] font-extrabold bg-[#FAF8F5]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Öne Çıkar</span>
                <span className="sm:hidden">Vitrin</span>
              </span>
              {activeSubTab === 'onecikar' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4424]" />
              )}
            </button>
          </div>

          {/* TAB 1: MAĞAZAM & FİNANS İÇERİĞİ (TÜM KARTLAR ÇALIŞIR HALE GETİRİLDİ) */}
          {activeSubTab === 'magazam' && (
            <div className="p-5 space-y-5">
              {/* 3 Etkileşimli Kart: Performansım | Satışlarım | Mağaza Bakiyem */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Kart 1: Performansım */}
                <div 
                  onClick={() => setIsPerformanceModalOpen(true)}
                  className="bg-[#FAF8F5] hover:bg-white rounded-2xl p-4 border border-[#E8E2D8] hover:border-[#9E4424] flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-stone-900">Performansım</span>
                  <span className="text-[11px] text-emerald-800 font-semibold mt-0.5">{totalViews} Görüntülenme</span>
                  <span className="text-[10px] text-stone-400 mt-0.5">Analitiği Gör →</span>
                </div>

                {/* Kart 2: Satışlarım */}
                <div 
                  onClick={() => setIsSalesModalOpen(true)}
                  className="bg-[#FAF8F5] hover:bg-white rounded-2xl p-4 border border-[#E8E2D8] hover:border-[#9E4424] flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-stone-900">Satışlarım</span>
                  <span className="text-[11px] text-blue-800 font-semibold mt-0.5">{salesCount} Sipariş Alındı</span>
                  <span className="text-[10px] text-stone-400 mt-0.5">Kargoları Yönet →</span>
                </div>

                {/* Kart 3: Mağaza Bakiyem */}
                <div 
                  onClick={() => setIsWalletModalOpen(true)}
                  className="bg-[#FAF8F5] hover:bg-white rounded-2xl p-4 border border-[#E8E2D8] hover:border-[#9E4424] flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="w-11 h-11 rounded-full bg-amber-50 text-[#9E4424] border border-[#EBD4BF] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Wallet className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-stone-900">Mağaza Bakiyem</span>
                  <span className="text-xs font-extrabold text-[#9E4424] mt-0.5">{availableBalance.toLocaleString('tr-TR')} TL</span>
                  <span className="text-[10px] text-stone-400 mt-0.5">Para Çek & IBAN →</span>
                </div>
              </div>

              {/* Kampanya Banner'ı */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#0F172A] text-white p-5 shadow-sm">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[9px] tracking-wide uppercase">
                      DOKAN LITE AYRICALIĞI
                    </span>
                    <h4 className="text-sm sm:text-base font-bold leading-snug">
                      5 ÜRÜN YÜKLE, SIFIR KOMİSYON AYRICALIĞI KAZAN!
                    </h4>
                    <p className="text-xs text-blue-200">
                      İlk satışlarınızda platform komisyonu %0. Eşyalarınız anında vitrine taşınsın.
                    </p>
                  </div>

                  <button
                    onClick={onOpenSellerModal}
                    className="px-5 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    Hemen Yükle
                  </button>
                </div>
              </div>

              {/* Bekleyen Aksiyonların */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800">Bekleyen Satıcı Aksiyonların</h4>
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between gap-3 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FAF3EB] text-[#9E4424] shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-stone-700 font-medium">
                      Avantajlı satış fırsatlarına katılmak için hemen ilk ürününü yüklemeye başla!
                    </p>
                  </div>
                  <button
                    onClick={onOpenSellerModal}
                    className="text-xs font-bold text-[#9E4424] hover:text-[#85361A] flex items-center gap-0.5 shrink-0 cursor-pointer"
                  >
                    <span>Katıl</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hızlı Satış İpuçları (Tıklanabilir Rehberler) */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-stone-800">Hızlı Satış İpuçları</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                    <strong className="text-stone-900 block font-semibold">1. Gün Işığında Çekin</strong>
                    <p className="text-[11px] text-stone-500">Doğal ışıkta çekilen vintage fotoğraflar %50 daha hızlı satılır.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                    <strong className="text-stone-900 block font-semibold">2. Hafıza Notunu Yazın</strong>
                    <p className="text-[11px] text-stone-500">Eşyanın nereden geldiği ve hatırası alıcıda duygusal bağ kurar.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                    <strong className="text-stone-900 block font-semibold">3. Ücretsiz Kargo Baremi</strong>
                    <p className="text-[11px] text-stone-500">750 TL ve üzeri ürünlerde kargo ücretsiz görünerek öne çıkar.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ÜRÜNLERİM (SİLME, DÜZENLEME VE ÖNE ÇIKARMA BUTONLARI ÇALIŞIR) */}
          {activeSubTab === 'urunlerim' && (
            <div className="p-5 space-y-4">
              {userProducts.length === 0 ? (
                <div className="py-14 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#FAF3EB] text-[#9E4424] flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-stone-900 font-serif">Henüz satışta ilanınız yok</h4>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      Gardırobundaki nostaljik veya vintage parçaları yükleyerek mağazanı hemen canlandırabilirsin.
                    </p>
                  </div>
                  <button
                    onClick={onOpenSellerModal}
                    className="px-6 py-2.5 rounded-full bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    + İlk İlanını Aç
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userProducts.map((prod) => {
                    const isBoosted = boostedProductIds.includes(prod.id);
                    return (
                      <div key={prod.id} className="p-3.5 rounded-2xl border border-[#E8E2D8] bg-white shadow-2xs flex flex-col justify-between space-y-3">
                        <div>
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-stone-100">
                            <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                            
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-stone-700 shadow-2xs">
                              {prod.condition}
                            </span>

                            {isBoosted && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs animate-pulse">
                                <Flame className="w-3 h-3" />
                                <span>Vitrinde Sabit</span>
                              </span>
                            )}

                            <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                              Stok: {prod.stock || 1} Adet
                            </span>
                          </div>

                          <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">{prod.title}</h5>
                          <p className="text-[11px] text-stone-500 mt-0.5">{prod.brand} • {prod.categoryLabel}</p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                          <span className="text-base font-extrabold text-[#9E4424] font-sans">
                            {prod.price.toLocaleString('tr-TR')} TL
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleBoostProduct(prod.id)}
                              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isBoosted
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-800'
                              }`}
                              title="Vitrinde Öne Çıkar"
                            >
                              <Flame className="w-3.5 h-3.5" />
                              <span className="text-[10px]">{isBoosted ? 'Öne Çıkarıldı' : 'Öne Çıkar'}</span>
                            </button>

                            {onDeleteProduct && (
                              <button
                                onClick={() => {
                                  if (confirm(`"${prod.title}" ilanını silmek istediğinize emin misiniz?`)) {
                                    onDeleteProduct(prod.id);
                                    showToast('İlan başarıyla kaldırıldı.');
                                  }
                                }}
                                className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="İlanı Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GELEN TEKLİFLER (PAZARLIK MASASI) */}
          {activeSubTab === 'teklifler' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Pazarlık Masası & Gelen Fiyat Teklifleri
                  </h4>
                  <p className="text-xs text-stone-500">
                    Alıcıların ürünlerinize sunduğu teklifleri inceleyin, onaylayın veya reddedin.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {offers.length} Teklif Kaydı
                </span>
              </div>

              {offers.length === 0 ? (
                <div className="text-center py-12 bg-[#FAF8F5] rounded-2xl border border-dashed border-stone-300 p-6 space-y-2">
                  <Tag className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold text-stone-700">Henüz gelen bir teklif yok</p>
                  <p className="text-xs text-stone-400">Alıcılar vitrindeki veya mağazanızdaki ürünlerinize teklif sunduğunda burada listelenecektir.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product snippet & buyer message */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <img
                          src={offer.productImage}
                          alt={offer.productTitle}
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              Alıcı: {offer.buyerName}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>

                          <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 mt-1 truncate">
                            {offer.productTitle}
                          </h5>

                          {offer.message && (
                            <p className="text-xs text-stone-600 italic bg-[#FAF8F5] p-2 rounded-lg border border-stone-200/60 mt-1.5">
                              "{offer.message}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Prices & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        <div className="text-left sm:text-right">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-stone-400 line-through">
                              {offer.originalPrice.toLocaleString('tr-TR')} TL
                            </span>
                            <span className="text-base sm:text-lg font-black text-[#9E4424]">
                              {offer.offeredPrice.toLocaleString('tr-TR')} TL
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            %{offer.discountPercentage} İndirim Teklifi
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {offer.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => {
                                  onAcceptOffer && onAcceptOffer(offer.id);
                                  showToast(`✅ ${offer.buyerName} adlı alıcının ${offer.offeredPrice} TL teklifi kabul edildi! Ürün 24 saat rezerve edildi.`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                              >
                                Kabul Et
                              </button>
                              <button
                                onClick={() => {
                                  onRejectOffer && onRejectOffer(offer.id);
                                  showToast(`❌ Teklif reddedildi.`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 font-bold text-xs border border-stone-200 transition-colors cursor-pointer"
                              >
                                Reddet
                              </button>
                            </>
                          ) : offer.status === 'accepted' ? (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Onaylandı (Rezerve)</span>
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-xl">
                              Reddedildi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ÖNE ÇIKAR (GERÇEK DOKAN PROMOTION SEÇENEKLERİ) */}
          {activeSubTab === 'onecikar' && (
            <div className="p-5 space-y-4">
              <div className="text-center space-y-1 mb-4">
                <h4 className="font-serif font-bold text-base text-stone-900">Vitrin & Satış Hızlandırma Paketleri</h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Ürünlerinizi aramalarda ve ana sayfa vitrininde öne çıkararak satış sürenizi 3 kat hızlandırın.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/50 space-y-2 relative">
                  <span className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    En Çok Tercih Edilen
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Ana Sayfa Vitrini (3 Gün)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    İlanınız ana sayfadaki 'En Çok İlgi Görenler' vitrininin en üstünde yer alır.
                  </p>
                  <button
                    onClick={() => {
                      if (userProducts.length > 0) {
                        handleBoostProduct(userProducts[0].id);
                      } else {
                        onOpenSellerModal();
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Ürünü Vitrine Sabitle
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Kategori Üst Sıra (7 Gün)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Kategori filtrelemelerinde alıcıların karşısına ilk sıralarda çıkar.
                  </p>
                  <button
                    onClick={() => {
                      if (userProducts.length > 0) {
                        handleBoostProduct(userProducts[0].id);
                      } else {
                        onOpenSellerModal();
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Kategoride Öne Çıkar
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Altın Mühürlü Rozet</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Hafıza pasaportu kutusuna parlayan altın mühür ve nostaljik kurdele ekler.
                  </p>
                  <button
                    onClick={() => showToast('✨ Altın mühür rozeti ürünlerinize tanımlandı!')}
                    className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Rozeti Etkinleştir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ÇALIŞAN MODALLAR (EKSİK TÜM AKIŞLARIN ARAYÜZLERİ) */}
      {/* ======================================================== */}

      {/* MODAL 1: PROFİL VE MAĞAZA AYARLARI DÜZENLEME MODALI */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto max-h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95">
            <div className="bg-white border-b border-[#E8E2D8] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#9E4424]" />
                <h3 className="font-serif font-bold text-base text-stone-900">Profil & Mağaza Bilgileri</h3>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Ad Soyad (Görünen İsim)</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kullanıcı Adı (@)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Telefon Numarası</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Şehir / Lokasyon</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Dokan Satış Kazançları İçin IBAN</label>
                <input
                  type="text"
                  required
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="w-full p-2.5 font-mono text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">Tamamlanan sipariş tutarları bu hesaba aktarılır.</span>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Mağaza Biyografisi</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9E4424] hover:bg-[#85361A] text-white rounded-xl font-bold"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PERFORMANSIM VE ANALİTİK MODALI */}
      {isPerformanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E8E2D8] p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-base text-stone-900">Mağaza Performans Raporu</h3>
              </div>
              <button onClick={() => setIsPerformanceModalOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-semibold block">Toplam Ziyaretçi</span>
                <span className="text-xl font-black text-emerald-950 font-sans">{totalViews}</span>
                <span className="text-[10px] text-emerald-700 mt-1 block">Bu hafta +%24 artış</span>
              </div>
              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200">
                <span className="text-[11px] text-rose-800 font-semibold block">Favorilere Ekleme</span>
                <span className="text-xl font-black text-rose-950 font-sans">{totalLikes}</span>
                <span className="text-[10px] text-rose-700 mt-1 block">Yüksek alıcı ilgisi</span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
              <span className="font-bold text-stone-800 block">En Çok İlgi Gören İlanınız:</span>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-stone-700">90'lar Orijinal Hakiki Deri Ceket</span>
              </div>
              <p className="text-[11px] text-stone-500">Ortalama sepet dönüşüm oranınız: <strong>%4.8</strong> (Platform ortalamasının üzerinde).</p>
            </div>

            <button
              onClick={() => setIsPerformanceModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-black"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: SATIŞLARIM & SİPARİŞ LİSTESİ MODALI */}
      {isSalesModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E8E2D8] p-6 space-y-4 animate-in fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h3 className="font-serif font-bold text-base text-stone-900">Satışlarım ve Gönderiler</h3>
              </div>
              <button onClick={() => setIsSalesModalOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 text-xs">
              {orders.map((ord) => (
                <div key={ord.id} className="p-3.5 rounded-2xl border border-stone-200 bg-[#FAF8F5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                      {ord.status === 'completed' ? 'Teslim Edildi' : ord.status === 'shipped' ? 'Kargoda' : 'Hazırlanıyor'}
                    </span>
                  </div>
                  <div className="text-stone-700">
                    {ord.items.map((i) => i.product.title).join(', ')}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200 text-stone-500">
                    <span>Alıcı: {ord.customer.name}</span>
                    <strong className="text-stone-900 font-sans">{ord.total.toLocaleString('tr-TR')} TL</strong>
                  </div>
                  {ord.trackingNumber && (
                    <div className="text-[10px] bg-blue-50 text-blue-900 p-1.5 rounded-lg border border-blue-200 font-mono">
                      Takip Kodu: {ord.trackingNumber}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsSalesModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-black shrink-0"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: MAĞAZA BAKİYEM & DOKAN WALLET MODALI */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E8E2D8] p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#9E4424]" />
                <h3 className="font-serif font-bold text-base text-stone-900">Dokan Satıcı Cüzdanı</h3>
              </div>
              <button onClick={() => setIsWalletModalOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#EBD4BF] text-center space-y-1">
              <span className="text-xs text-stone-600 block">Çekilebilir Net Bakiye:</span>
              <span className="text-2xl sm:text-3xl font-black text-[#9E4424] font-sans block">
                {availableBalance.toLocaleString('tr-TR')} TL
              </span>
              <span className="text-[11px] text-stone-500 block">
                Bekleyen Havuz Bakiyesi (Alıcı Onayı): <strong>{pendingBalance.toLocaleString('tr-TR')} TL</strong>
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
              <span className="text-stone-500 block text-[10px]">Tanımlı Havale IBAN Hesabı:</span>
              <code className="font-mono font-bold text-stone-800 text-[11px] block">{iban}</code>
              <span className="text-[10px] text-emerald-700">✓ Ziraat Bankası - Semih Akkoyun</span>
            </div>

            <button
              onClick={handleWithdrawFunds}
              className="w-full py-3 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Hesabıma Aktar (IBAN Transferi)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
