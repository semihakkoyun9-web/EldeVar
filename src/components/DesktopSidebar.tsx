/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProductCategory } from '../types';
import { StandardFilters } from './StandardFilterBar';
import { ConditionKey, CONDITION_THEMES } from '../utils/conditionTheme';
import { Sparkles, SlidersHorizontal, BookOpen, Feather, X, Check, ShieldCheck, Leaf } from 'lucide-react';

interface DesktopSidebarProps {
  filters: StandardFilters;
  onChangeFilter: <K extends keyof StandardFilters>(key: K, value: StandardFilters[K]) => void;
  onResetFilters: () => void;
  selectedCondition: ConditionKey | 'all';
  onSelectCondition: (cond: ConditionKey | 'all') => void;
  conditionCounts: Record<ConditionKey | 'all', number>;
  categoryCounts: Record<ProductCategory | 'all', number>;
  availableBrands: string[];
  availableSizes: string[];
  onOpenPassportSample: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  selectedCondition,
  onSelectCondition,
  conditionCounts,
  categoryCounts,
  availableBrands,
  availableSizes,
  onOpenPassportSample,
}) => {
  const isAnyFilterActive =
    filters.category !== 'all' ||
    filters.size !== 'all' ||
    filters.brand !== 'all' ||
    filters.priceRange !== 'all' ||
    selectedCondition !== 'all';

  const conditionItems: Array<{
    key: ConditionKey;
    label: string;
    sublabel: string;
    themeKey: ConditionKey;
    desc: string;
  }> = [
    {
      key: 'yeni_gibi',
      label: 'Yeni Gibi (Kusursuz)',
      sublabel: 'Yeşil Çerçeve',
      themeKey: 'yeni_gibi',
      desc: 'Etiketsiz veya sıfır ayarında',
    },
    {
      key: 'az_kullanilmis',
      label: 'Az Kullanılmış',
      sublabel: 'Mavi Çerçeve',
      themeKey: 'az_kullanilmis',
      desc: 'Temiz, hasarsız ve özenli',
    },
    {
      key: 'cok_kullanilmis',
      label: 'Çok Kullanılmış',
      sublabel: 'Kehribar Çerçeve',
      themeKey: 'cok_kullanilmis',
      desc: 'Karakterli ve yaşanmışlık izi',
    },
    {
      key: 'vintage',
      label: 'Vintage / Koleksiyonluk',
      sublabel: 'Kiremit Çerçeve',
      themeKey: 'vintage',
      desc: 'Özel dönem parçası & hatıralık',
    },
  ];

  const categories: Array<{ id: ProductCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'Tüm Kategoriler', icon: '✨' },
    { id: 'kadin', label: 'Kadın Giyim', icon: '👗' },
    { id: 'erkek', label: 'Erkek Giyim', icon: '👔' },
    { id: 'cocuk', label: 'Çocuk & Bebek', icon: '🧸' },
    { id: 'ayakkabi', label: 'Ayakkabı', icon: '👞' },
    { id: 'canta_aksesuar', label: 'Çanta & Aksesuar', icon: '👜' },
    { id: 'elektronik', label: 'Elektronik & Nostalji', icon: '📷' },
    { id: 'ev_yasam', label: 'Ev & Yaşam', icon: '🏺' },
  ];

  const priceOptions: Array<{ id: StandardFilters['priceRange']; label: string }> = [
    { id: 'all', label: 'Tümü' },
    { id: '0-500', label: '0 – 500 TL' },
    { id: '500-1500', label: '500 – 1.500 TL' },
    { id: '1500-3000', label: '1.500 – 3.000 TL' },
    { id: '3000+', label: '3.000 TL ve Üzeri' },
  ];

  return (
    <aside className="w-72 xl:w-80 shrink-0 space-y-5 font-sans">
      {/* Top Sidebar Header with Filter Reset */}
      <div className="bg-white rounded-2xl border border-[#E8E2D8] p-4 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#9E4424]" />
            <h3 className="font-serif font-bold text-stone-900 text-sm">Filtreler</h3>
          </div>
          {isAnyFilterActive && (
            <button
              onClick={onResetFilters}
              className="text-[11px] font-semibold text-[#9E4424] hover:text-[#803318] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Sıfırla</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 1. DİNAMİK KONDİSYON ÇERÇEVELERİ (Siteye Özgü İstek) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9E4424]" />
              <span>Kondisyon Çerçeve Rengi</span>
            </label>
            <span className="text-[10px] text-stone-500 font-medium">Canlı Renk</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-tight">
            Seçtiğiniz kondisyona ait çerçeve rengi ürünlerde otomatik parlar.
          </p>

          <div className="space-y-1.5 pt-1">
            {/* All conditions option */}
            <button
              onClick={() => onSelectCondition('all')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                selectedCondition === 'all'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-700 border-[#E8E2D8] hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">✨</span>
                <span className="font-medium">Tüm Çerçeveler</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                selectedCondition === 'all' ? 'bg-stone-800 text-stone-300' : 'bg-white text-stone-500 border border-[#E8E2D8]'
              }`}>
                {conditionCounts.all}
              </span>
            </button>

            {/* Individual Colored Frame Buttons */}
            {conditionItems.map((item) => {
              const theme = CONDITION_THEMES[item.themeKey];
              const isSelected = selectedCondition === item.key;
              const count = conditionCounts[item.key];

              return (
                <button
                  key={item.key}
                  onClick={() => onSelectCondition(item.key)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer group ${
                    isSelected
                      ? `${theme.badgeBgClass} ${theme.borderClass} ${theme.badgeTextClass} ring-2 ring-current/25 font-bold shadow-xs`
                      : 'bg-white border-[#E8E2D8] text-stone-700 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${theme.borderClass}`}
                      style={{ backgroundColor: theme.hexColor }}
                    />
                    <div className="truncate">
                      <div className="font-medium truncate">{item.label}</div>
                      <div className="text-[10px] text-stone-400 group-hover:text-stone-500 font-normal">
                        {item.sublabel}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 ${
                      isSelected
                        ? 'bg-white/80 border border-current/20'
                        : 'bg-[#FAF8F5] text-stone-500 border border-[#E8E2D8]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. KATEGORİLER */}
        <div className="space-y-2 pt-3 border-t border-[#F0EBE1]">
          <label className="text-xs font-bold text-stone-800 block">Kategoriler</label>
          <div className="space-y-1">
            {categories.map((cat) => {
              const isSelected = filters.category === cat.id;
              const count = categoryCounts[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => onChangeFilter('category', cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF4ED] text-[#9E4424] font-bold border border-[#EBD6C3]'
                      : 'text-stone-700 hover:bg-[#FAF8F5] border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. BEDEN / EBAT SEÇİCİ */}
        <div className="space-y-2 pt-3 border-t border-[#F0EBE1]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800">Beden & Ebat</label>
            {filters.size !== 'all' && (
              <button
                onClick={() => onChangeFilter('size', 'all')}
                className="text-[10px] text-[#9E4424] hover:underline"
              >
                Temizle
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onChangeFilter('size', 'all')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                filters.size === 'all'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-[#FAF8F5] text-stone-600 border-[#E8E2D8] hover:bg-stone-100'
              }`}
            >
              Tümü
            </button>
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => onChangeFilter('size', filters.size === size ? 'all' : size)}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center truncate transition-colors cursor-pointer ${
                  filters.size === size
                    ? 'bg-[#9E4424] text-white border-[#9E4424] font-bold'
                    : 'bg-white text-stone-700 border-[#E8E2D8] hover:bg-[#FAF8F5]'
                }`}
                title={size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 4. MARKALAR */}
        <div className="space-y-2 pt-3 border-t border-[#F0EBE1]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800">Markalar</label>
            {filters.brand !== 'all' && (
              <button
                onClick={() => onChangeFilter('brand', 'all')}
                className="text-[10px] text-[#9E4424] hover:underline"
              >
                Temizle
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {availableBrands.map((brand) => {
              const isSelected = filters.brand.toLowerCase() === brand.toLowerCase();
              return (
                <button
                  key={brand}
                  onClick={() => onChangeFilter('brand', isSelected ? 'all' : brand)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#9E4424] text-white border-[#9E4424] font-bold shadow-2xs'
                      : 'bg-white text-stone-700 border-[#E8E2D8] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. FİYAT ARALIĞI */}
        <div className="space-y-2 pt-3 border-t border-[#F0EBE1]">
          <label className="text-xs font-bold text-stone-800 block">Fiyat Aralığı</label>
          <div className="space-y-1">
            {priceOptions.map((opt) => {
              const isSelected = filters.priceRange === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onChangeFilter('priceRange', opt.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF4ED] text-[#9E4424] font-bold border border-[#EBD6C3]'
                      : 'text-stone-600 hover:bg-[#FAF8F5] border border-transparent'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#9E4424]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. DESKTOP SİTEYE ÖZGÜ İMZA ÖZELLİK VİTRİNİ: HAFIZA PASAPORTU & MÜHÜR */}
      <div className="rounded-2xl bg-radial from-[#FDF9F5] to-[#F5ECE0] border border-[#E3D3C1] p-4.5 space-y-3 shadow-2xs text-[#2A241F]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#9E4424] text-white flex items-center justify-center font-serif text-sm shadow-xs font-bold">
            EV
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs text-stone-900 leading-tight">
              Eşya Hafıza Pasaportu
            </h4>
            <span className="text-[10px] text-[#9E4424] font-semibold tracking-wider uppercase">
              Mum Mühürlü Teslimat
            </span>
          </div>
        </div>

        <p className="text-[11px] text-stone-600 leading-relaxed">
          EldeVar'da her parçanın geçmişi belgelenir. Satıcının veda mektubu ve karbon tasarruf sertifikası mum mühürlü kraft zarfla size ulaşır.
        </p>

        <div className="pt-1">
          <button
            onClick={onOpenPassportSample}
            className="w-full py-2 px-3 bg-white hover:bg-stone-50 border border-[#DFCBB6] text-[#9E4424] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Feather className="w-3.5 h-3.5 text-[#9E4424]" />
            <span>Örnek Pasaportu İncele</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-[#E8DACB]">
          <span className="flex items-center gap-1">
            <Leaf className="w-3 h-3 text-emerald-600" />
            <span>Sıfır Yeni Üretim</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#9E4424]" />
            <span>Korumalı Alışveriş</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
