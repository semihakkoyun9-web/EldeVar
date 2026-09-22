import React, { useState } from 'react';
import { 
  ArrowLeft, Share2, MoreVertical, Bell, Plus, ChevronRight, 
  TrendingUp, ShoppingBag, Wallet, Sparkles, Tag, CheckCircle2,
  AlertCircle, Package, ExternalLink, ShieldCheck, Heart, Users, Eye, Trash2
} from 'lucide-react';
import { Product } from '../types';

interface UserStoreViewProps {
  onBack: () => void;
  onOpenSellerModal: () => void;
  userProducts?: Product[];
  onDeleteProduct?: (productId: string) => void;
}

export const UserStoreView: React.FC<UserStoreViewProps> = ({
  onBack,
  onOpenSellerModal,
  userProducts = [],
  onDeleteProduct,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'magazam' | 'urunlerim' | 'onecikar'>('magazam');
  const [balance, setBalance] = useState(0.00);

  return (
    <div className="w-full bg-[#F5F5F7] min-h-screen pb-24 text-stone-800">
      {/* 1. ÜST GEZİNME VE İŞLEM ÇUBUĞU (Görsel 2'deki gibi) */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          title="Geri Dön"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            title="Mağazayı Paylaş"
          >
            <Share2 className="w-5 h-5 stroke-[2]" />
          </button>

          <button
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            title="Diğer Seçenekler"
          >
            <MoreVertical className="w-5 h-5 stroke-[2]" />
          </button>

          <div className="relative">
            <button
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              title="Bildirimler"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
            </button>
            <span className="absolute top-1 right-0.5 px-1 py-0.2 rounded-full bg-[#E53935] text-white text-[9px] font-extrabold tracking-tighter shadow-2xs">
              12
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* 2. PROFİL BAŞLIĞI VE İSTATİSTİKLER (Görsel 2) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
          {/* Avatar & Kullanıcı Adı */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9E4424] via-[#D97746] to-[#F29E6D] p-0.5 shadow-xs flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl font-bold font-serif text-[#9E4424]">
                  S
                </div>
              </div>
              <button
                onClick={onOpenSellerModal}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-2xs cursor-pointer hover:bg-emerald-600"
                title="Fotoğraf veya Ürün Ekle"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-900 font-sans tracking-tight">
                2semih5
              </h2>
              <p className="text-xs text-stone-400">semihakkoyun9@gmail.com</p>
            </div>
          </div>

          {/* İstatistik Çizelgesi: 0 Satış | 7 Takipçi | 5 Takip | 70 Favori */}
          <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-4 divide-x divide-stone-200 text-center">
            <div className="px-1">
              <span className="block text-base font-bold text-stone-900 leading-tight">0</span>
              <span className="text-[11px] text-stone-500 font-medium">Satış</span>
            </div>
            <div className="px-1">
              <span className="block text-base font-bold text-stone-900 leading-tight">7</span>
              <span className="text-[11px] text-stone-500 font-medium">Takipçi</span>
            </div>
            <div className="px-1">
              <span className="block text-base font-bold text-stone-900 leading-tight">5</span>
              <span className="text-[11px] text-stone-500 font-medium">Takip</span>
            </div>
            <div className="px-1">
              <span className="block text-base font-bold text-stone-900 leading-tight">70</span>
              <span className="text-[11px] text-stone-500 font-medium">Favori</span>
            </div>
          </div>

          {/* "Profil Detayı [YENİ]" Butonu (Görsel 2'deki tasarım) */}
          <div className="mt-4">
            <button className="w-full py-2 px-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <span>Profil Detayı</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#E53935] text-white text-[9px] font-extrabold uppercase tracking-tight">
                YENİ
              </span>
            </button>
          </div>
        </div>

        {/* 3. SEKMELER: Mağazam | Ürünlerim | Öne Çıkar */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-3 border-b border-stone-200 text-center text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('magazam')}
              className={`py-3.5 transition-colors cursor-pointer relative ${
                activeSubTab === 'magazam'
                  ? 'text-[#9E4424] font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>Mağazam</span>
              {activeSubTab === 'magazam' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4424]" />
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('urunlerim')}
              className={`py-3.5 transition-colors cursor-pointer relative ${
                activeSubTab === 'urunlerim'
                  ? 'text-[#9E4424] font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>Ürünlerim ({userProducts.length})</span>
              {activeSubTab === 'urunlerim' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4424]" />
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('onecikar')}
              className={`py-3.5 transition-colors cursor-pointer relative ${
                activeSubTab === 'onecikar'
                  ? 'text-[#9E4424] font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>Öne Çıkar</span>
              {activeSubTab === 'onecikar' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4424]" />
              )}
            </button>
          </div>

          {/* TAB 1: MAĞAZAM İÇERİĞİ (Görsel 2) */}
          {activeSubTab === 'magazam' && (
            <div className="p-4 space-y-4">
              {/* 3 Hızlı Aksiyon Kartı: Performansım | Satışlarım | Dolap/EldeVar Bakiyem */}
              <div className="grid grid-cols-3 gap-3">
                {/* Kart 1: Performansım */}
                <div className="bg-[#FAF8F5] rounded-xl p-3 border border-stone-200/80 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">Performansım</span>
                  <span className="text-[9px] text-stone-400 mt-0.5">0 görüntülenme</span>
                </div>

                {/* Kart 2: Satışlarım */}
                <div className="bg-[#FAF8F5] rounded-xl p-3 border border-stone-200/80 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">Satışlarım</span>
                  <span className="text-[9px] text-stone-400 mt-0.5">0 sipariş</span>
                </div>

                {/* Kart 3: Dolap Bakiyem */}
                <div className="bg-[#FAF8F5] rounded-xl p-3 border border-stone-200/80 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-[#9E4424] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <Wallet className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">Mağaza Bakiyem</span>
                  <span className="text-[10px] font-extrabold text-[#9E4424] mt-0.5">0,00 TL</span>
                </div>
              </div>

              {/* Kampanya / Çekiliş Banner'ı (Görsel 2'deki Vespa vb. Kampanyalar) */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#0F172A] text-white p-4 shadow-xs">
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="space-y-1 max-w-[70%]">
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[9px] tracking-wide uppercase">
                      ÖZEL FIRSAT
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold leading-snug">
                      5 ÜRÜN YÜKLE, SIFIR KOMİSYON AYRICALIĞI KAZAN!
                    </h4>
                    <p className="text-[10px] text-blue-200">
                      İlk satışlarınızda EldeVar komisyonu %0.
                    </p>
                  </div>

                  <button
                    onClick={onOpenSellerModal}
                    className="px-3.5 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    Hemen Yükle
                  </button>
                </div>

                <div className="absolute bottom-2 right-3 text-[9px] text-white/50 font-mono">
                  1/4
                </div>
              </div>

              {/* Bekleyen Aksiyonların (Görsel 2) */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-stone-700">Bekleyen Aksiyonların</h4>
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-stone-200 text-stone-700 shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-stone-700 font-medium leading-snug">
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

              {/* Hızlı Satış İpuçları & Aksiyon Butonları (Görsel 2'deki + Ürün Ekle butonu) */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-stone-700 mb-2">Hızlı Satış İpuçları</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenSellerModal}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Ürün Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ÜRÜNLERİM LİSTESİ */}
          {activeSubTab === 'urunlerim' && (
            <div className="p-4 space-y-4">
              {userProducts.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Package className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-stone-800">Henüz satışta ürünün yok</h4>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      Gardırobundaki nostaljik veya vintage parçaları yükleyerek mağazanı hemen canlandırabilirsin.
                    </p>
                  </div>
                  <button
                    onClick={onOpenSellerModal}
                    className="px-5 py-2.5 rounded-full bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    + İlk Ürününü Ekle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userProducts.map((prod) => (
                    <div key={prod.id} className="p-3 rounded-2xl border border-stone-200 bg-white shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-stone-100">
                          <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-bold text-stone-700 shadow-2xs">
                            {prod.condition}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-stone-900 line-clamp-1">{prod.title}</h5>
                        <p className="text-[11px] text-stone-500 mt-0.5">{prod.brand} • {prod.categoryLabel}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-[#9E4424] font-sans">
                          {prod.price.toLocaleString('tr-TR')} TL
                        </span>
                        {onDeleteProduct && (
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="İlanı Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ÖNE ÇIKAR */}
          {activeSubTab === 'onecikar' && (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-[#9E4424] flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Ürünlerini Vitrine Taşı</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Ürünlerini kategori sayfalarında ve aramalarda üst sıralara çıkararak daha hızlı satış yapabilirsin.
              </p>
              <button
                onClick={onOpenSellerModal}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-black cursor-pointer"
              >
                Yeni Ürün Ekleyip Öne Çıkar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
