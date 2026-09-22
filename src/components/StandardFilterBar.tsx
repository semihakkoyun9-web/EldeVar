/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProductCategory } from '../types';
import { SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';

export interface StandardFilters {
  category: ProductCategory | 'all';
  size: string | 'all';
  brand: string | 'all';
  priceRange: 'all' | '0-500' | '500-1500' | '1500-3000' | '3000+';
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'likes';
}

interface StandardFilterBarProps {
  filters: StandardFilters;
  onChangeFilter: <K extends keyof StandardFilters>(key: K, value: StandardFilters[K]) => void;
  onResetFilters: () => void;
  onOpenAdvancedModal: () => void;
  availableBrands: string[];
  availableSizes: string[];
}

export const StandardFilterBar: React.FC<StandardFilterBarProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  onOpenAdvancedModal,
  availableBrands,
  availableSizes,
}) => {
  const isAnyFilterActive =
    filters.category !== 'all' ||
    filters.size !== 'all' ||
    filters.brand !== 'all' ||
    filters.priceRange !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] p-3 sm:p-4 shadow-2xs space-y-3 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* 1. Category */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E4DDCF] rounded-xl px-2.5 py-1.5">
            <span className="text-stone-500 font-medium">Kategori:</span>
            <select
              value={filters.category}
              onChange={(e) => onChangeFilter('category', e.target.value as ProductCategory | 'all')}
              className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="giyim">Giyim & Vintage</option>
              <option value="elektronik">Teknoloji & Analog</option>
              <option value="ev_yasam">Ev & Yaşam</option>
            </select>
          </div>

          {/* 2. Beden / Boy */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E4DDCF] rounded-xl px-2.5 py-1.5">
            <span className="text-stone-500 font-medium">Beden / Boy:</span>
            <select
              value={filters.size}
              onChange={(e) => onChangeFilter('size', e.target.value)}
              className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="all">Tüm Bedenler</option>
              {availableSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Marka */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E4DDCF] rounded-xl px-2.5 py-1.5">
            <span className="text-stone-500 font-medium">Marka:</span>
            <select
              value={filters.brand}
              onChange={(e) => onChangeFilter('brand', e.target.value)}
              className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="all">Tüm Markalar</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Fiyat Aralığı */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E4DDCF] rounded-xl px-2.5 py-1.5">
            <span className="text-stone-500 font-medium">Fiyat:</span>
            <select
              value={filters.priceRange}
              onChange={(e) => onChangeFilter('priceRange', e.target.value as StandardFilters['priceRange'])}
              className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="all">Tüm Fiyatlar</option>
              <option value="0-500">0 - 500 TL</option>
              <option value="500-1500">500 - 1.500 TL</option>
              <option value="1500-3000">1.500 - 3.000 TL</option>
              <option value="3000+">3.000 TL ve Üzeri</option>
            </select>
          </div>
        </div>

        {/* Right Side: Sorting & Advanced Filter Modal Button */}
        <div className="flex items-center gap-2 ml-auto text-xs">
          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E4DDCF] rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#9E4424]" />
            <select
              value={filters.sortBy}
              onChange={(e) => onChangeFilter('sortBy', e.target.value as StandardFilters['sortBy'])}
              className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="newest">En Yeniler</option>
              <option value="price_asc">Fiyat: Artan</option>
              <option value="price_desc">Fiyat: Azalan</option>
              <option value="likes">En Çok Beğenilen</option>
            </select>
          </div>

          {/* Advanced Categories & Filter Modal Trigger */}
          <button
            onClick={onOpenAdvancedModal}
            className="inline-flex items-center gap-1.5 bg-[#FAF3EB] hover:bg-[#F3E7D7] border border-[#E9D5C0] text-[#8C3F23] font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Detaylı Filtre</span>
            <span className="sm:hidden">Filtre</span>
          </button>

          {/* Reset Filters */}
          {isAnyFilterActive && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-xl transition-colors"
              title="Tüm filtreleri sıfırla"
            >
              <span>Temizle</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
