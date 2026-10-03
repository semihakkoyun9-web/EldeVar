/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Plus, Bell, ChevronDown, BookOpen, Compass, ArrowRight, LogIn } from 'lucide-react';
import { ProductCategory, NotificationItem, AuthUser } from '../types';
import { TabType } from './BottomNav';
import { EldeVarSeal } from './EldeVarLogo';

interface DesktopHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount: number;
  cartCount: number;
  cartSubtotal: number;
  notifications: NotificationItem[];
  onOpenSellerModal: () => void;
  onOpenPassportSample: () => void;
  onOpenMemoryBox?: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  activeTab,
  onTabChange,
  favoritesCount,
  cartCount,
  cartSubtotal,
  notifications,
  onOpenSellerModal,
  onOpenPassportSample,
  onOpenMemoryBox,
  currentUser,
  onOpenAuthModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const quickSearchTags = [
    'Vintage Ceket',
    'Analog Fotoğraf',
    'El Dokuma Kilim',
    'Pikap & Plak',
    'Dr. Martens',
    "Levi's 501",
    'Burberry Palto',
  ];

  const mainCategories: Array<{
    id: ProductCategory;
    label: string;
    subcategories: string[];
  }> = [
    {
      id: 'kadin',
      label: 'Kadın',
      subcategories: ['Elbise', 'Tişört & Bluz', 'Palto & Kaban', 'Triko Kazak', 'Etek', 'Gömlek', 'Ceket'],
    },
    {
      id: 'erkek',
      label: 'Erkek',
      subcategories: ['Deri Bomber Ceket', "Levi's Jean", 'Oxford Gömlek', 'Sweatshirt', 'Kazak & Hırka'],
    },
    {
      id: 'cocuk',
      label: 'Çocuk',
      subcategories: ['Salopet Tulum', 'Retro Paten', 'Ahşap Oyuncak', 'Bebek Giysisi', 'Çocuk Ayakkabısı'],
    },
    {
      id: 'ayakkabi',
      label: 'Ayakkabı',
      subcategories: ['Dr. Martens Bot', 'Converse Sneaker', 'Deri Loafer & Makosen', 'Topuklu & Klasik'],
    },
    {
      id: 'canta_aksesuar',
      label: 'Çanta & Aksesuar',
      subcategories: ['Hakiki Deri Çanta', 'Vakko İpek Fular', 'Kol Saati', 'Güneş Gözlüğü', 'Cüzdan'],
    },
    {
      id: 'elektronik',
      label: 'Elektronik',
      subcategories: ['35mm Analog Makine', 'Pikap & Ses Sistemi', 'Sony Kulaklık', 'Kindle E-Kitap', 'Apple Watch'],
    },
    {
      id: 'ev_yasam',
      label: 'Ev & Yaşam',
      subcategories: ['El Dokuma Kilim', 'Dual Pikap', 'Pirinç Masa Lambası', 'İskandinav Ahşap Sehpa'],
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] text-[#1C1917] shadow-xs">
      {/* 1. ÜST ANA HEADER SATIRI */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* LOGO: "EldeVar" - E ve V renkleri farklı (#9E4424), Pazaryeri yazısı kaldırıldı */}
        <div
          className="shrink-0 cursor-pointer group flex items-center gap-2.5 select-none"
          onClick={() => {
            onTabChange('home');
            onSelectCategory('all');
          }}
        >
          {/* Mühür Amblem (EV Mührü) */}
          <div className="group-hover:scale-105 group-hover:rotate-1 transition-all duration-200 shrink-0">
            <EldeVarSeal size={42} />
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-serif font-black tracking-tight text-[#1C1917] group-hover:opacity-90 transition-opacity leading-none">
              <span className="text-[#9E4424]">E</span>lde<span className="text-[#9E4424]">V</span>ar
            </span>
            <span className="text-[10px] text-stone-500 font-sans tracking-tight mt-0.5">
              Eski hikâyeler yeni sahibiyle canlanıyor
            </span>
          </div>
        </div>

        {/* ORTA: ARAMA ÇUBUĞU */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Vintage ceket, analog makine, kök boya kilim, pikap veya eşya hatırası ara..."
              className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-11 pr-10 py-2.5 rounded-full border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424] focus:ring-2 focus:ring-[#9E4424]/10 transition-all placeholder:text-stone-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                aria-label="Aramayı Temizle"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* SAĞ AKSİYON BUTONLARI: Kompakt, Düzenli & Profil En Sağda */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 0. Bunu Arıyorum Butonu (Çok Görünür, Prestijli ve Ana Aksiyon) */}
          <button
            onClick={() => onTabChange('wanted')}
            className={`h-9 px-3.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs ${
              activeTab === 'wanted'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-[#FAF3E8] hover:bg-[#F3E7D5] text-[#9E4424] border-2 border-[#9E4424] hover:border-[#85361A] shadow-2xs'
            }`}
            title="Aradığın eşyayı yaz, 'Bende Var' diyenler teklif versin"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.8]" />
            <span>Bunu Arıyorum</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#9E4424] text-white text-[9px] font-black uppercase">
              Yeni
            </span>
          </button>

          {/* 1. İlan Ver Butonu */}
          <button
            onClick={onOpenSellerModal}
            className="h-9 px-3.5 rounded-full bg-[#9E4424] hover:bg-[#85361A] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Eşya Sat & Hikâye Ekle"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
            <span>İlan Ver</span>
          </button>

          {/* Hatıra Kutusu Butonu */}
          {onOpenMemoryBox && (
            <button
              onClick={onOpenMemoryBox}
              className="h-9 px-3 rounded-full bg-[#FAF3EB] hover:bg-[#F3E5D3] text-[#8C3F23] border border-[#EBD4BF] font-semibold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Eşya Hatıra Kutusu"
            >
              <span>🧳</span>
              <span>Hatıra Kutusu</span>
            </button>
          )}

          {/* 2. Favorilerim (Kompakt Yuvarlak İkon) */}
          <button
            onClick={() => onTabChange('favorites')}
            className={`w-9 h-9 rounded-full border transition-all relative cursor-pointer flex items-center justify-center shadow-2xs ${
              activeTab === 'favorites'
                ? 'bg-[#FAF4ED] text-[#9E4424] border-[#EBD6C3] ring-1 ring-[#9E4424]/20'
                : 'bg-[#FAF8F5] hover:bg-[#F2ECE2] text-stone-700 border-[#E5DDD1]'
            }`}
            title="Favorilerim"
            aria-label="Favorilerim"
          >
            <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-[#9E4424] text-[#9E4424]' : 'text-stone-600'}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9E4424] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none ring-2 ring-white">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* 3. Sepetim (Kompakt Yuvarlak İkon) */}
          <button
            onClick={() => onTabChange('cart')}
            className={`w-9 h-9 rounded-full border transition-all relative cursor-pointer flex items-center justify-center shadow-2xs ${
              activeTab === 'cart'
                ? 'bg-[#FAF4ED] text-[#9E4424] border-[#EBD6C3] ring-1 ring-[#9E4424]/20'
                : 'bg-[#FAF8F5] hover:bg-[#F2ECE2] text-stone-700 border-[#E5DDD1]'
            }`}
            title={`Sepetim (${cartSubtotal > 0 ? `${cartSubtotal.toLocaleString('tr-TR')} TL` : 'Boş'})`}
            aria-label="Sepetim"
          >
            <ShoppingBag className={`w-4 h-4 ${activeTab === 'cart' ? 'text-[#9E4424]' : 'text-stone-600'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9E4424] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* 4. Bildirimler Popover (Kompakt Yuvarlak İkon) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-9 h-9 rounded-full border transition-all relative cursor-pointer flex items-center justify-center shadow-2xs ${
                showNotifications
                  ? 'bg-[#FAF4ED] text-[#9E4424] border-[#EBD6C3] ring-1 ring-[#9E4424]/20'
                  : 'bg-[#FAF8F5] hover:bg-[#F2ECE2] text-stone-700 border-[#E5DDD1]'
              }`}
              title="Bildirimler"
              aria-label="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9E4424] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 bg-white border border-[#E4DDCF] rounded-2xl shadow-xl p-4 z-50 text-stone-800 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 mb-2">
                  <span className="font-serif font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                    <Bell className="w-4 h-4 text-[#9E4424]" />
                    EldeVar Bildirimleri
                  </span>
                  <span className="text-[11px] text-stone-500">{notifications.length} bildirim</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        n.read ? 'bg-[#FAF8F5] border-[#EAE4D9]' : 'bg-[#FDF9F3] border-[#F1DCC9]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-semibold text-stone-900">{n.title}</span>
                        <span className="text-[10px] text-stone-400">{n.time}</span>
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 pt-2 border-t border-stone-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#9E4424] hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Profil / Hesabım / Giriş Yap (EN SAĞDA) */}
          {currentUser ? (
            <button
              onClick={() => onTabChange('menu')}
              className={`h-9 pl-1 pr-3 rounded-full border transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold shadow-2xs ${
                activeTab === 'menu'
                  ? 'bg-[#FAF4ED] text-[#9E4424] border-[#EBD6C3] ring-1 ring-[#9E4424]/20'
                  : 'bg-[#FAF8F5] hover:bg-[#F2ECE2] text-stone-800 border-[#E5DDD1]'
              }`}
              title="Hesabım & Profilim"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2D2620] to-[#1C1917] text-[#FAF4ED] flex items-center justify-center text-[11px] font-serif font-bold shadow-2xs border border-[#44382F] overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <span>{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onOpenAuthModal) onOpenAuthModal();
                else onTabChange('menu');
              }}
              className="h-9 px-3 rounded-full border border-[#9E4424]/30 bg-[#FAF4ED] hover:bg-[#F4EAE0] text-[#9E4424] font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Giriş Yap veya Kayıt Ol"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Giriş Yap</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. GENİŞ KATEGORİ ÇUBUĞU (Kullanıcının İstediği Geniş Kategori Barı) */}
      <div className="bg-[#FAF8F5] border-t border-[#EAE4D8] px-6 py-1.5 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Geniş Kategoriler: Kadın, Erkek, Çocuk, Ayakkabı, Çanta & Aksesuar, Elektronik, Ev & Yaşam */}
            {mainCategories.map((cat) => {
              const isSelected = activeTab === 'categories' && selectedCategory === cat.id;
              const isHovered = hoveredCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onTabChange('categories');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#9E4424] shadow-2xs border border-[#E2DBD0]'
                        : 'text-stone-700 hover:text-[#9E4424] hover:bg-white/80'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown className="w-3 h-3 text-stone-400 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Mega Subcategory Dropdown on Hover */}
                  {isHovered && (
                    <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-xl border border-[#E8E2D8] p-3 z-50 space-y-1 animate-in fade-in-50 duration-150">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 py-1">
                        {cat.label} Kategorisi
                      </div>
                      {cat.subcategories.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            onSelectCategory(cat.id);
                            onSearchChange(sub);
                            onTabChange('categories');
                            setHoveredCategory(null);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-[#FAF4ED] hover:text-[#9E4424] transition-colors cursor-pointer"
                        >
                          {sub}
                        </button>
                      ))}
                      <div className="pt-2 border-t border-stone-100">
                        <button
                          onClick={() => {
                            onSelectCategory(cat.id);
                            onSearchChange('');
                            onTabChange('categories');
                            setHoveredCategory(null);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#9E4424] hover:underline flex items-center justify-between cursor-pointer"
                        >
                          <span>Tümünü Gör</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Özel 'Kategoriler & Filtreler' Butonu: Kullanıcının İstediği Direkt Sayfaya Gitme Butonu */}
            <button
              onClick={() => onTabChange('categories')}
              className={`ml-2 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#9E4424] text-white shadow-2xs'
                  : 'bg-white text-[#9E4424] border border-[#DFCBB6] hover:bg-[#FAF4ED] shadow-2xs'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tüm Filtreler & Kategoriler</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
