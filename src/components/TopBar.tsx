import React, { useState } from 'react';
import { Search, Bell, SlidersHorizontal, Plus, Heart, User, X } from 'lucide-react';
import { ProductCategory, NotificationItem } from '../types';
import { EldeVarSeal } from './EldeVarLogo';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  notifications: NotificationItem[];
  onOpenCategoriesModal: () => void;
  activeStoryFilter?: string | null;
  onClearStoryFilter?: () => void;
  onNavigateHome?: () => void;
  onOpenSellerModal?: () => void;
  onNavigateFavorites?: () => void;
  onNavigateMenu?: () => void;
  favoritesCount?: number;
  cartCount?: number;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  notifications,
  onOpenCategoriesModal,
  activeStoryFilter,
  onClearStoryFilter,
  onNavigateHome,
  onOpenSellerModal,
  onNavigateFavorites,
  onNavigateMenu,
  favoritesCount = 0,
  className = '',
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const quickCategories: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tümü', icon: '✨' },
    { id: 'kadin', label: 'Kadın', icon: '👗' },
    { id: 'erkek', label: 'Erkek', icon: '🧥' },
    { id: 'canta_aksesuar', label: 'Çanta', icon: '👜' },
    { id: 'ayakkabi', label: 'Ayakkabı', icon: '👟' },
    { id: 'elektronik', label: 'Teknoloji', icon: '📷' },
    { id: 'ev_yasam', label: 'Ev & Yaşam', icon: '🏺' },
    { id: 'cocuk', label: 'Çocuk', icon: '🧸' },
  ];

  return (
    <header className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] text-[#1C1917] shadow-xs pt-safe ${className}`}>
      {/* 1. ROW: BRAND LOGO & TOP ACTION ICONS */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          className="shrink-0 flex items-center gap-2 select-none text-left cursor-pointer active:scale-95 transition-transform"
          onClick={() => {
            onSelectCategory('all');
            onNavigateHome?.();
          }}
          aria-label="Ana Sayfaya Git"
        >
          <div className="shrink-0">
            <EldeVarSeal size={30} />
          </div>
          <span className="text-xl font-serif font-black tracking-tight text-[#1C1917] leading-none">
            <span className="text-[#9E4424]">E</span>lde<span className="text-[#9E4424]">V</span>ar
          </span>
        </button>

        {/* Action Buttons: Sell, Favorites, Notifications, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Sell Button */}
          {onOpenSellerModal && (
            <button
              onClick={onOpenSellerModal}
              className="flex items-center gap-1 bg-[#9E4424] hover:bg-[#85361A] text-white px-2.5 py-1.5 rounded-full font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Ücretsiz İlan Ver"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="font-sans text-[11px] font-bold">Sat</span>
            </button>
          )}

          {/* Favorites Button */}
          {onNavigateFavorites && (
            <button
              onClick={onNavigateFavorites}
              className="relative p-2 rounded-full bg-[#FAF8F5] active:bg-[#F2ECE1] border border-[#E4DDCF] text-stone-700 transition-colors"
              aria-label="Favorilerim"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-[#FAF8F5] active:bg-[#F2ECE1] border border-[#E4DDCF] text-stone-700 transition-colors"
              aria-label="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9E4424] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-76 sm:w-84 bg-white border border-[#E4DDCF] rounded-2xl shadow-xl p-3 z-50 text-stone-800 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                  <span className="font-serif font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                    <Bell className="w-3.5 h-3.5 text-[#9E4424]" />
                    Bildirimler
                  </span>
                  <span className="text-[10px] text-stone-500">{notifications.length} bildirim</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-xl border text-[11px] transition-colors ${
                        n.read ? 'bg-[#FAF8F5] border-[#EAE4D9]' : 'bg-[#FDF9F3] border-[#F1DCC9]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <span className="font-semibold text-stone-900">{n.title}</span>
                        <span className="text-[9px] text-stone-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-stone-600 text-[10px] leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-stone-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#9E4424] hover:underline text-[11px] font-semibold"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          {onNavigateMenu && (
            <button
              onClick={onNavigateMenu}
              className="p-1.5 rounded-full bg-[#FAF3EB] border border-[#EBD7BF] text-[#9E4424] active:scale-95 transition-all"
              aria-label="Profil ve Hesabım"
              title="Hesabım"
            >
              <User className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. ROW: FULL-WIDTH LIVE SEARCH BAR + FILTER MODAL BUTTON */}
      <div className="px-3.5 pb-2.5 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Eşya, vintage mont, pikap veya anı ara..."
            className="w-full bg-[#FAF8F5] text-stone-800 text-xs pl-9 pr-8 py-2 rounded-full border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424] focus:ring-1 focus:ring-[#9E4424] transition-all placeholder:text-stone-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 text-xs font-bold"
              aria-label="Aramayı Temizle"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <button
          onClick={onOpenCategoriesModal}
          className="shrink-0 p-2 rounded-full bg-[#FAF5EE] active:bg-[#F0E6D8] text-[#9E4424] border border-[#E7D7C1] shadow-2xs transition-colors"
          title="Filtreler ve Kategoriler"
          aria-label="Filtreleri Aç"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#9E4424]" />
        </button>
      </div>

      {/* 3. ROW: HORIZONTAL CATEGORY SCROLL PILLS (TOUCH FRIENDLY, NO SCROLLBAR) */}
      <div className="bg-[#FAF8F5]/80 border-t border-[#EDE7DC] px-3 py-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {quickCategories.map((cat) => {
            const isActive = selectedCategory === cat.id && !activeStoryFilter;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (onClearStoryFilter) onClearStoryFilter();
                  onSelectCategory(cat.id);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#9E4424] text-white font-bold shadow-xs'
                    : 'bg-white text-stone-700 border border-[#E2DBD0] active:bg-stone-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
