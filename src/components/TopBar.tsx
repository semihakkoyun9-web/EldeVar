import React, { useState } from 'react';
import { Search, Bell, Grid, Sparkles, Compass, X } from 'lucide-react';
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
  className = '',
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const quickCategories: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tüm Eşyalar', icon: '✨' },
    { id: 'giyim', label: 'Giyim & Vintage', icon: '🧥' },
    { id: 'elektronik', label: 'Teknoloji & Analog', icon: '📷' },
    { id: 'ev_yasam', label: 'Ev & Koleksiyon', icon: '🏺' },
  ];

  return (
    <header className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] text-[#1C1917] shadow-xs ${className}`}>
      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo: Chic EldeVar with EV Seal */}
        <div
          className="shrink-0 cursor-pointer flex items-center gap-2 group select-none"
          onClick={() => {
            onSelectCategory('all');
            onNavigateHome?.();
          }}
        >
          <div className="shrink-0 group-hover:scale-105 transition-all">
            <EldeVarSeal size={34} />
          </div>
          <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#1C1917] leading-none">
            <span className="text-[#9E4424]">E</span>lde<span className="text-[#9E4424]">V</span>ar
          </span>
        </div>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Vintage ceket, analog makine, kök boya kilim veya hikâye ara..."
              className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-9 py-2 rounded-full border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424] focus:ring-2 focus:ring-[#9E4424]/10 transition-all placeholder:text-stone-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                aria-label="Aramayı Temizle"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action: Comprehensive Categories Button & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Comprehensive Categories Button */}
          <button
            onClick={onOpenCategoriesModal}
            className="flex items-center gap-2 bg-[#FAF5EE] hover:bg-[#F4ECE0] text-[#9E4424] border border-[#E7D7C1] font-semibold text-xs px-3.5 py-2 rounded-full transition-all active:scale-95 shadow-2xs group"
            title="Tüm Kategorileri ve Hikâye Koleksiyonlarını Gör"
          >
            <Grid className="w-3.5 h-3.5 text-[#9E4424] group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-sans">Kategoriler</span>
            <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-[#9E4424]"></span>
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#E4DDCF] text-stone-700 transition-colors"
              aria-label="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9E4424] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E4DDCF] rounded-2xl shadow-xl p-3.5 z-50 text-stone-800 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 mb-2">
                  <span className="font-serif font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                    <Bell className="w-3.5 h-3.5 text-[#9E4424]" />
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
                        <span className="font-medium text-stone-900">{n.title}</span>
                        <span className="text-[10px] text-stone-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 pt-2 border-t border-stone-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#9E4424] hover:underline text-[11px] font-medium"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category & Story Shortcuts Bar */}
      <div className="bg-[#FAF8F5] border-t border-[#EDE7DC] px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            <span className="text-[11px] text-stone-400 font-medium shrink-0 mr-1 hidden sm:inline">Hızlı Seçim:</span>
            {quickCategories.map((cat) => {
              const isActive = selectedCategory === cat.id && !activeStoryFilter;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (onClearStoryFilter) onClearStoryFilter();
                    onSelectCategory(cat.id);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#9E4424] text-white font-semibold shadow-xs'
                      : 'bg-white text-stone-700 border border-[#E2DBD0] hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick link to Open Categories */}
          <button
            onClick={onOpenCategoriesModal}
            className="text-[11px] text-[#9E4424] font-semibold hover:underline shrink-0 hidden sm:flex items-center gap-1"
          >
            <span>Tüm Koleksiyonlar & Hikâyeler</span>
            <Compass className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
